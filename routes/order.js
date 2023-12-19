const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  countOrder,
  countTotalOrderIncome,
  countTotalOrderWeakSale,
} = require("../controllers/orderControllers");

router.get("/orders", countOrder);
router.get("/orders/income", countTotalOrderIncome);
router.get("/orders/weakSales", countTotalOrderWeakSale);

module.exports = router;
