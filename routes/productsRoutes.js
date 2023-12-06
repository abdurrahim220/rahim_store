const express = require("express");
const router = express.Router();
const {
  getProductById,
  deleteProductById,
  createProduct,
  updateProductById,
  getAllProducts,
} = require("../controllers/productControllers");

router.post("/products", createProduct).get("/products", getAllProducts);
router.put("/products/:id", updateProductById);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProductById);

module.exports = router;
