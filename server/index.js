import { createServer } from 'node:http'
import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const distDir = join(rootDir, 'dist')
const donationAmounts = new Set([10000, 25000, 50000, 100000])

if (existsSync(join(rootDir, '.env'))) {
  for (const line of readFileSync(join(rootDir, '.env'), 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}

const port = Number(process.env.API_PORT || 4242)

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 8192) {
      const error = new Error('Request body is too large.')
      error.statusCode = 413
      throw error
    }
  }
  try {
    return JSON.parse(body || '{}')
  } catch {
    const error = new Error('Request body must be valid JSON.')
    error.statusCode = 400
    throw error
  }
}

function getAppUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production') throw new Error('APP_URL must be configured in production.')
  return 'http://localhost:5173'
}

async function stripeRequest(path, options = {}) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new Error('Payments are not configured. Set STRIPE_SECRET_KEY on the server.')

  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(options.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      ...options.headers,
    },
  })
  const result = await response.json()
  if (!response.ok) {
    console.error('Stripe API error:', result.error?.message || response.statusText)
    throw new Error('Stripe could not process the request. Please try again.')
  }
  return result
}

async function createCheckoutSession(request, response) {
  const { amount } = await readJsonBody(request)
  if (!donationAmounts.has(amount)) {
    return sendJson(response, 400, { error: 'Choose one of the available donation amounts.' })
  }

  const appUrl = getAppUrl()
  const params = new URLSearchParams({
    mode: 'payment',
    'line_items[0][price_data][currency]': 'php',
    'line_items[0][price_data][product_data][name]': 'Common Ground Project donation',
    'line_items[0][price_data][product_data][description]': 'A contribution toward shared community garden spaces.',
    'line_items[0][price_data][unit_amount]': String(amount),
    'line_items[0][quantity]': '1',
    success_url: `${appUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/?checkout=cancelled#get-involved`,
  })
  const session = await stripeRequest('checkout/sessions', { method: 'POST', body: params })
  if (!session.url) throw new Error('Stripe did not return a checkout URL. Please try again.')
  sendJson(response, 200, { url: session.url })
}

async function checkCheckoutSession(request, response, url) {
  const sessionId = url.searchParams.get('session_id')
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return sendJson(response, 400, { error: 'A valid checkout session is required.' })
  }
  const session = await stripeRequest(`checkout/sessions/${encodeURIComponent(sessionId)}`)
  sendJson(response, 200, { paid: session.payment_status === 'paid' })
}

async function serveStatic(pathname, response, headOnly = false) {
  if (!existsSync(distDir)) return sendJson(response, 404, { error: 'Frontend build not found. Run the production build first.' })

  let relativePath
  try {
    relativePath = decodeURIComponent(pathname)
  } catch {
    return sendJson(response, 400, { error: 'Invalid URL.' })
  }
  const safePath = normalize(relativePath).replace(/^([/\\])+/, '')
  let filePath = resolve(distDir, safePath || 'index.html')
  if (!filePath.startsWith(`${distDir}${sep}`) && filePath !== join(distDir, 'index.html')) {
    return sendJson(response, 403, { error: 'Forbidden.' })
  }

  try {
    if (!(await stat(filePath)).isFile()) filePath = join(distDir, 'index.html')
  } catch {
    filePath = join(distDir, 'index.html')
  }
  response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' })
  if (headOnly) return response.end()
  createReadStream(filePath).pipe(response)
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
  try {
    if (request.method === 'POST' && url.pathname === '/api/create-checkout-session') {
      await createCheckoutSession(request, response)
      return
    }
    if (request.method === 'GET' && url.pathname === '/api/checkout-session') {
      await checkCheckoutSession(request, response, url)
      return
    }
    if (url.pathname.startsWith('/api/')) {
      sendJson(response, 404, { error: 'API route not found.' })
      return
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendJson(response, 405, { error: 'Method not allowed.' })
      return
    }
    await serveStatic(url.pathname, response, request.method === 'HEAD')
  } catch (error) {
    console.error(error)
    sendJson(response, error.statusCode || 500, { error: error.message || 'An unexpected server error occurred.' })
  }
})

server.listen(port, () => console.log(`Common Ground API listening on http://localhost:${port}`))