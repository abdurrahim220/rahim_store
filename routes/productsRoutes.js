const express = require("express");
const router = express.Router();
const {
  getProductById,
  deleteProductById,
  createProduct,
  updateProductById,
  getAllProducts,
  createNewProduct
} = require("../controllers/productControllers");

router.post("/products", createProduct).get("/products", getAllProducts);
router.put("/products/:id", updateProductById);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProductById);
router.post("/newProducts", createNewProduct)

module.exports = router;
