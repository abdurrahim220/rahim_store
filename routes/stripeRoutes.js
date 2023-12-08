// routes/stripeRoutes.js

const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Create a Checkout Session
router.post('/create-checkout-session', stripeController.createCheckoutSession);

// Handle Stripe webhook events (optional)
router.post('/webhook', stripeController.handleWebhookEvents);

module.exports = router;
