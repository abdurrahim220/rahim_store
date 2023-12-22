const moment = require("moment");
const Order = require("../models/Order");

// Controller for getting all orders
const getAllOrders = async (req, res) => {
  const query = req.query.new;
  try {
    const orders = query
      ? await Order.find().sort({ _id: -1 }).limit(4)
      : await Order.find().sort({ _id: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllOrderAccordingToDate = async (req, res) => {
  try {
    const latestOrders = await Order.find().sort({ createdAt: -1 });
    res.json(latestOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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


const updateStatus = async(req,res)=>{
  try {
    const updateOrder = await Order.findByIdAndUpdate(req.params.id,{
      $set:req.body,
    },{
      new:true
    })
    res.status(200).json(updateOrder)
  } catch (error) {
    res.status(500).send(err)
  }
}


const singleOrder = async(req,res)=>{
try {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "order not found" });
  }

  res.status(200).json(order);
  
} catch (error) {
  res.status(500).send(error)
}

}
module.exports = {
  updateStatus,
  singleOrder,
  getAllOrders,
  countOrder,
  countTotalOrderIncome,
  countTotalOrderWeakSale,getAllOrderAccordingToDate
};
