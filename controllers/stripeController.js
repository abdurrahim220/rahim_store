// controllers/stripeController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a Checkout Session
const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Product',
            },
            unit_amount: 1000, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://your-website.com/success', // Redirect URL after successful payment
      cancel_url: 'https://your-website.com/cancel', // Redirect URL after canceled payment
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Handle Stripe webhook events (optional)
const handleWebhookEvents = (req, res) => {
  const payload = req.rawBody;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(400).json({ error: 'Webhook Error' });
  }

  // Handle the event (update your database, send confirmation emails, etc.)
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Payment succeeded, update your database or take other actions
      break;
    // Handle other events as needed

    default:
      // Unexpected event type
      return res.status(400).end();
  }

  res.json({ received: true });
};

module.exports = { createCheckoutSession, handleWebhookEvents };
