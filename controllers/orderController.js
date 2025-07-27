import Order from "../models/Order.js";
import moment from "moment";
import status from "http-status";
// Controller for getting all orders
const getAllOrders = async (req, res) => {
  const query = req.query.new;
  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });

    return res.status(status.OK).json({
      message: "Orders retrieved successfully",
      total: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const getAllOrderAccordingToDate = async (req, res) => {
  try {
    const latestOrders = await Order.find().sort({ createdAt: -1 });
    res.json(latestOrders);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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

const updateStatus = async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(500).send(err);
  }
};

const singleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add this new controller method to orderController.js
const getOrderStats = async (req, res) => {
  try {
    // Get current month and previous month
    const currentMonth = moment().month();
    const previousMonth = moment().month(moment().month() - 1);
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get monthly comparison
    const monthlyStats = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
          totalRevenue: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get current and previous month stats
    const currentMonthStats = monthlyStats.find(stat => stat._id === currentMonth + 1);
    const prevMonthStats = monthlyStats.find(stat => stat._id === previousMonth.month() + 1);
    
    // Calculate percentages
    const orderPercentage = prevMonthStats 
      ? ((currentMonthStats?.count - prevMonthStats.count) / prevMonthStats.count * 100).toFixed(2)
      : 0;
      
    const revenuePercentage = prevMonthStats 
      ? ((currentMonthStats?.totalRevenue - prevMonthStats.totalRevenue) / prevMonthStats.totalRevenue * 100).toFixed(2)
      : 0;

    res.status(200).json({
      totalOrders,
      monthlyStats,
      currentMonthStats,
      prevMonthStats,
      orderPercentage,
      revenuePercentage
    });
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const orderController = {
  getAllOrders,
  updateStatus,
  singleOrder,
  deleteOrder,
  getOrderStats,
  countTotalOrderIncome,
  countTotalOrderWeakSale,
  getAllOrderAccordingToDate,
};
