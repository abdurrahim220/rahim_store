const express = require("express");
const router = express.Router();

const {
  updateStatus,
  getAllOrders,
  countOrder,
  singleOrder,
  countTotalOrderIncome,
  countTotalOrderWeakSale,
  getAllOrderAccordingToDate,
  deleteOrder,
} = require("../controllers/orderControllers");

router.get("/orders", countOrder);
router.put("/orders/:id", updateStatus);
router.delete("/orders/:id", deleteOrder);
router.get("/single/orders/:id", singleOrder);
router.get("/orders/all", getAllOrders);
router.get("/orders/income", countTotalOrderIncome);
router.get("/orders/weakSales", countTotalOrderWeakSale);
router.get("/latest-orders", getAllOrderAccordingToDate);

module.exports = router;
