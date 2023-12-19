const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  countOrder,
  countTotalOrderIncome,
  countTotalOrderWeakSale,getAllOrderAccordingToDate
} = require("../controllers/orderControllers");

router.get("/orders", countOrder);
router.get("/orders/all", getAllOrders);
router.get("/orders/income", countTotalOrderIncome);
router.get("/orders/weakSales", countTotalOrderWeakSale);
router.get('/latest-orders',getAllOrderAccordingToDate)

module.exports = router;
