// add api code here
import stripe from 'stripe';

// 1. connect with stripe
// auth with stripe
const stripeServer = stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(400).json({ error: 'METHOD NOT ALLOWED' });
  }

  // 2. get the required information for the purchase from the request

  // Url to return on payment success
  const successUrl = 'http://localhost:3000/success';
  // Url to return on payment cancel
  const cancelUrl = 'http://localhost:3000/canceled';

  const quantity = request.body.quantity;
  const mode = request.body.mode;
  const priceId = request.body.priceId;

  // 3. create Checkout session
  const session = await stripeServer.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: mode,
    line_items: [{ price: priceId, quantity: quantity }],
    // Add here a query param to receive back the checkout session id
    success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: cancelUrl,
  });

  // 4. response the client with the new session
  if (!session) {
    return response.status(400).json({ error: 'create session failed' });
  }

  // 5. return Checkout session
  response.status(200).json({ session: session });
}
