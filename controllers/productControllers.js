const Products = require("../models/Products");

const cloudinary = require("../utils/cloudinary");

const createNewProduct = async (req, res) => {
  try {
    const { title, price, desc, image, category } = req.body;
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "onlineShop",
      });
      if (uploadRes) {
        const newProduct = new Products({
          title,
          price,
          desc,
          image: uploadRes,
          category,
        });
        const savedProduct = await newProduct.save();

        res.status(200).json(savedProduct);
      }
    }
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    
    const allProducts = await Products.find();

    
    res.status(200).json(allProducts);
  } catch (error) {
    
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Products.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const productToDelete = await Products.findById(id);

    if (!productToDelete) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (productToDelete.image && productToDelete.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        productToDelete.image.public_id
      );

      if (!destroyResponse.result || destroyResponse.result !== "ok") {
        return res
          .status(500)
          .json({ error: "Failed to delete image from Cloudinary" });
      }
    }

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(deletedProduct);
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.image) {
      if (req.body.image.public_id) {
        const destroyResponse = await cloudinary.uploader.destroy(
          req.body.image.public_id
        );

        if (destroyResponse.result === "ok") {
          const uploadResponse = await cloudinary.uploader.upload(
            req.body.image,
            {
              upload_preset: "onlineShop",
            }
          );

          if (uploadResponse) {
            req.body.image = {
              public_id: uploadResponse.public_id,
              secure_url: uploadResponse.secure_url,
            };
          }
        } else {
          return res
            .status(500)
            .json({ error: "Failed to delete existing image from Cloudinary" });
        }
      }
    }

    const updatedProduct = await Products.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProductById,
  deleteProductById,

  updateProductById,
  getAllProducts,
  createNewProduct,
};
