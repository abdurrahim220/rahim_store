import status from "http-status";
import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

const createProduct = async (req, res) => {
  try {
    const { title, price, desc, category } = req.body;

    console.log(title,price,desc,category)
    if (!title || !price || !desc || !category) {
      return res.status(status.BAD_REQUEST).json({
        error: "All fields (title, price, desc, category) are required",
      });
    }
    if (!req.files || !req.files.image || Array.isArray(req.files.image)) {
      return res.status(status.BAD_REQUEST).json({
        error: "Single image file is required",
      });
    }
    const uploadProductImage = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        folder: "products",
      }
    );
    const creatorId = req.user?.userId;
    console.log("creatorId",creatorId)
    if (!creatorId) {
      return res.status(status.UNAUTHORIZED).json({
        error: "User authentication required",
      });
    }
    // Checking for existing product with the same title and creator
    const existingProduct = await Product.findOne({ title, userId: creatorId });
    if (existingProduct) {
      return res.status(status.CONFLICT).json({
        error: "A product with this title already exists for this user",
      });
    }

    const product = await Product.create({
      title,
      price,
      desc,
      image: uploadProductImage.secure_url,
      cloudinary_id: uploadProductImage.public_id,
      category,
      userId: creatorId,
    });

    res.status(status.CREATED).json({
      status: "success",
      data: { product },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const query = req.query.search ? req.query.search.trim() : "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const searchCondition = query
      ? { title: { $regex: `.*${query}.*`, $options: "i" } }
      : {};

    const products = await Product.find(searchCondition)
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(searchCondition);

    res.status(200).json({
      status: "success",
      total,
      page,
      limit,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(status.NOT_FOUND).json({
        error: "Product not found",
      });
    }
    res.status(status.OK).json({
      status: "success",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(status.UNAUTHORIZED).json({
        error: "User authentication required",
      });
    }
    const userProducts = await Product.find({ userId });
    res.status(status.OK).json({
      status: "success",
      total: userProducts.length,
      products: userProducts,
    });
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.userId;
    console.log("productId", productId);
    console.log("userId", userId);
    if (!userId) {
      return res.status(status.UNAUTHORIZED).json({
        error: "User authentication required",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(status.NOT_FOUND).json({
        error: "Product not found",
      });
    }
    if (product.userId.toString() !== userId) {
      return res.status(status.FORBIDDEN).json({
        error: "You are not authorized to update this product",
      });
    }
    const { title, price, desc, category } = req.body;
    console.log(title,price,desc,category)
    if (!title || !price || !desc || !category) {
      return res.status(status.BAD_REQUEST).json({
        error: "All fields (title, price, desc, category) are required",
      });
    }
    if (req.files && req.files.image && !Array.isArray(req.files.image)) {
      if (product.cloudinary_id) {
        await cloudinary.uploader.destroy(product.cloudinary_id);
      }

      const uploadProductImage = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          folder: "products",
        }
      );
      product.cloudinary_id = uploadProductImage.public_id;
      product.image = uploadProductImage.secure_url;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        price,
        desc,
        category,
        image: product.image,
        cloudinary_id: product.cloudinary_id,
      },
      {
        new: true,
      }
    );

    res.status(status.OK).json({
      status: "success",
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user?.userId;
    console.log("productId", productId);
    console.log("userId", userId);
    if (!userId) {
      return res.status(status.UNAUTHORIZED).json({
        error: "User authentication required",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(status.NOT_FOUND).json({
        error: "Product not found",
      });
    }
    if (product.userId.toString() !== userId) {
      return res.status(status.FORBIDDEN).json({
        error: "You are not authorized to delete this product",
      });
    }
    if (product.cloudinary_id) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
    }
    await Product.findByIdAndDelete(productId);
    res.status(status.OK).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
    });
  }
};

export const productController = {
  createProduct,
  getAllProduct,
  getProductById,
  getUserProducts,
  updateProductById,
  deleteProduct,
};
