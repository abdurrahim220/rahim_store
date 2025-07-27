import { Router } from "express";
import { productController } from "../controllers/productController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post("/create-product", verifyToken, productController.createProduct);
router.get("/get-all", verifyToken, productController.getAllProduct);
router.get("/get-single/:id", verifyToken, productController.getProductById);
router.get(
  "/get-user-products/",
  verifyToken,
  productController.getUserProducts
);
router.put("/update/:id", verifyToken, productController.updateProductById);
router.delete("/delete/:id", verifyToken, productController.deleteProduct);


export const productRoute = router;
