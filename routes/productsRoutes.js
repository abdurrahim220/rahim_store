const express = require("express");
const router = express.Router();
const {
  getProductById,
  deleteProductById,
 
  updateProductById,
  getAllProducts,
  createNewProduct
} = require("../controllers/productControllers");

router.get("/products", getAllProducts);
router.put("/products/:id", updateProductById);
router.get("/products/:id", getProductById);
router.delete("/products/:id", deleteProductById);
router.post("/newProducts", createNewProduct)

module.exports = router;
