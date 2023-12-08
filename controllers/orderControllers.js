const Order = require('../models/Order');

// Controller for creating a new order
const createOrder = async (req, res) => {
  try {
    // Assuming request body contains order details
    const { orderId, amount, currency, paymentStatus, products } = req.body;
    console.log(orderId, amount, currency, paymentStatus, products )

    const newOrder = new Order({
      orderId,
      amount,
      currency,
      paymentStatus,
      products,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error('Error getting orders:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Other controllers for updating, deleting, or retrieving specific orders can be added similarly

module.exports = { createOrder, getAllOrders };
