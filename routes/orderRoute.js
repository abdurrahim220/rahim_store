import { Router } from "express";
import { orderController } from "../controllers/orderController.js";

const router = Router();

router.get("/all", orderController.getAllOrders);
router.put("/update/:id", orderController.updateStatus);
router.delete("/delete/:id", orderController.deleteOrder);
router.get("/single-order/:id", orderController.singleOrder);
router.get("/income", orderController.countTotalOrderIncome);
router.get("/weakSales", orderController.countTotalOrderWeakSale);
router.get("/latest-orders", orderController.getAllOrderAccordingToDate);
// Add this new route
router.get("/stats", orderController.getOrderStats);
export const orderRoute = router;
