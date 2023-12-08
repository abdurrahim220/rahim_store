const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create a new order
router.post('/orders', orderController.createOrder);

// Get all orders
router.get('/orders', orderController.getAllOrders);

// Other routes for updating, deleting, or retrieving specific orders can be added similarly

module.exports = router;
