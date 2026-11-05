import { useEffect, useState } from 'react'

const donationOptions = [
  { amount: 10000, label: '₱100' },
  { amount: 25000, label: '₱250' },
  { amount: 50000, label: '₱500' },
  { amount: 100000, label: '₱1,000' },
]

async function readApiResponse(response) {
  const responseText = await response.text()
  let result

  try {
    result = responseText ? JSON.parse(responseText) : null
  } catch {
    throw new Error(`The payment service returned an unreadable response (HTTP ${response.status}). Make sure the API server is running.`)
  }

  if (!result) {
    throw new Error(`The payment service returned an empty response (HTTP ${response.status}). Make sure the API server is running.`)
  }
  if (!response.ok) throw new Error(result.error || `The payment service returned HTTP ${response.status}.`)
  return result
}

function getPaymentErrorMessage(error, fallback) {
  if (error instanceof TypeError) return 'Cannot reach the payment API. Start it with npm run api, then try again.'
  return error.message || fallback
}

function DonationForm() {
  const [selectedAmount, setSelectedAmount] = useState(donationOptions[1].amount)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(() => (
    new URLSearchParams(window.location.search).get('checkout') === 'cancelled'
      ? 'Checkout was cancelled. Your card has not been charged.'
      : ''
  ))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checkoutStatus = params.get('checkout')
    const sessionId = params.get('session_id')

    if (checkoutStatus === 'cancelled') {
      params.delete('checkout')
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
      return
    }
    if (checkoutStatus !== 'success' || !sessionId) return

    let active = true
    fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const result = await readApiResponse(response)
        if (active) setMessage(result.paid ? 'Thank you for supporting a greener, more connected neighborhood!' : 'Your payment is still processing. Please check back shortly.')
      })
      .catch((error) => {
        if (active) setMessage(getPaymentErrorMessage(error, 'We could not verify your payment right now. Please contact us if you completed checkout.'))
      })
      .finally(() => {
        if (active) {
          params.delete('checkout')
          params.delete('session_id')
          const query = params.toString()
          window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
        }
      })

    return () => { active = false }
  }, [])

  async function startCheckout(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedAmount }),
      })
      const result = await readApiResponse(response)
      if (!result.url) throw new Error('Stripe did not provide a checkout link. Please try again.')
      window.location.assign(result.url)
    } catch (error) {
      setMessage(getPaymentErrorMessage(error, 'Checkout could not be started. Please try again.'))
      setLoading(false)
    }
  }

  return (
    <form className="donation-panel" onSubmit={startCheckout}>
      <div className="signup-label">SUPPORT THE GARDEN</div>
      <p className="donation-intro">Every contribution helps make shared growing spaces possible.</p>
      <fieldset className="donation-options">
        <legend className="sr-only">Choose a donation amount</legend>
        {donationOptions.map(({ amount, label }) => (
          <button
            aria-pressed={selectedAmount === amount}
            className={selectedAmount === amount ? 'donation-option selected' : 'donation-option'}
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            type="button"
          >
            {label}
          </button>
        ))}
      </fieldset>
      <button className="donate-button" disabled={loading} type="submit">
        {loading ? 'Connecting to Stripe…' : `Donate ${donationOptions.find(({ amount }) => amount === selectedAmount).label}`}
        {!loading && <span aria-hidden="true">↗</span>}
      </button>
      <p className="donation-security">Secure checkout powered by Stripe.</p>
      {message && <p className="donation-message" role="status">{message}</p>}
    </form>
  )
}

export default DonationForm