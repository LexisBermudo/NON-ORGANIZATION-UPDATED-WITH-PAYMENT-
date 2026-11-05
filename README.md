# Common Ground Project

A React and Vite website for the Common Ground Project, with a Node.js API that creates and verifies Stripe Checkout sessions for garden donations.

## Local development

1. Install the project dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `STRIPE_SECRET_KEY` to a Stripe test secret key from your Stripe dashboard. Never use a secret key in frontend code or commit it.
3. In one terminal, run `npm run api` to start the payment API on port 4242.
4. In another terminal, run `npm run dev` and open the Vite URL shown in the terminal.

The Vite development server proxies `/api` requests to the local payment API. The donation amount is selected from fixed server-validated options and checkout takes place on Stripe-hosted Checkout. Donations are charged in PHP.

## Production

Run `npm run build`, then start the API with `NODE_ENV=production`, `APP_URL` set to the public site origin, and `STRIPE_SECRET_KEY` set in the hosting environment. The API server serves the built `dist` site and its `/api` endpoints on the same origin. Do not expose the Stripe secret key as a `VITE_` variable. Use Stripe test keys until the site is ready to accept live payments.

The About page's text and biography details are maintained in `src/data/about.json`.
