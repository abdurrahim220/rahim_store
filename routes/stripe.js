import { Router } from "express";
import Stripe from "stripe";
import config from "../config/config";
import Order from "../models/orderModel"; // Make sure to import your Order model

const router = Router();
const stripe = new Stripe(config.stripeSecretKey);

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, userId } = req.body; // Fixed typo (useRId -> userId)

    // Validate input
    if (!cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Create customer in Stripe
    const customer = await stripe.customers.create({
      metadata: {
        userId,
        cart: JSON.stringify(
          cartItems.map((item) => ({
            id: item._id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
    });

    // Prepare line items
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          metadata: { id: item._id },
        },
        unit_amount: Math.round(item.price * 100), // Ensure proper rounding
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "usd" },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "usd" },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 1 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      line_items,
      customer: customer.id,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Error creating checkout session" });
  }
});

// Webhook handler
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
      }

      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        // Retrieve customer and line items
        const customer = await stripe.customers.retrieve(session.customer);
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );

        // Create order in database
        await createOrder(customer, session, lineItems);
      } catch (err) {
        console.error("Order processing error:", err);
      }
    }

    res.json({ received: true });
  }
);

// Order creation helper
const createOrder = async (customer, session, lineItems) => {
  try {
    const cartItems = JSON.parse(customer.metadata.cart);

    const order = new Order({
      userId: customer.metadata.userId,
      customerId: session.customer,
      paymentIntentId: session.payment_intent,
      products: lineItems.data.map((item) => ({
        productId: item.price_data.product_data.metadata.id,
        quantity: item.quantity,
        price: item.price_data.unit_amount / 100,
      })),
      subtotal: session.amount_subtotal / 100,
      total: session.amount_total / 100,
      shipping: session.shipping_details || session.customer_details,
      payment_status: session.payment_status,
    });

    await order.save();
    console.log("Order created successfully:", order._id);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const stripeRouter = router;
