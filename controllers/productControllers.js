const Products = require("../models/Products");

// Controller for handling the creation of a new product
const createProduct = async (req, res) => {
  try {
    const { title, price, desc, image, category } = req.body;
    const newProduct = new Products({
      title,
      price,
      desc,
      image,
      category,
    });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const allProducts = await Products.find();

    // Respond with the array of products
    res.status(200).json(allProducts);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Controller for retrieving a single product by ID
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller for deleting a single product by ID
const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Controller for updating a single product by ID
const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.body) {
      return res.status(400).json({ error: "Update data not provided" });
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProductById,
  deleteProductById,
  createProduct,
  updateProductById,
  getAllProducts,
};
