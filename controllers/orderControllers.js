const moment = require("moment");
const Order = require("../models/Order");

// Controller for creating a new order
const createOrder = async (req, res) => {
  try {
    // Assuming request body contains order details
    const { orderId, amount, currency, paymentStatus, products } = req.body;
    console.log(orderId, amount, currency, paymentStatus, products);

    const newOrder = new Order({
      orderId,
      amount,
      currency,
      paymentStatus,
      products,
    });

    const savedOrder = await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for getting all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const countOrder = async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm;ss");
  try {
    const orders = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const countTotalOrderIncome = async (req, res) => {
  const previousMonth = moment()
    .month(moment().month() - 1)
    .set("date", 1)
    .format("YYYY-MM-DD HH:mm;ss");
  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(previousMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          salary: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$salary" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const countTotalOrderWeakSale = async (req, res) => {
  const lastWeak = moment()
    .day(moment().day() - 7)
    .format("YYYY-MM-DD HH:mm;ss");
  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(lastWeak) } },
      },
      {
        $project: {
          day: { $dayOfWeek: "$createdAt" },
          salary: "$total",
        },
      },
      {
        $group: {
          _id: "$day",
          total: { $sum: "$salary" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  countOrder,
  countTotalOrderIncome,
  countTotalOrderWeakSale,
};
