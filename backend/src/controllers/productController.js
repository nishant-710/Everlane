const Product = require("../models/Product");
const Category = require("../models/Category");
const Filter = require("../models/Filter");
const mongoose = require("mongoose");

// Show Product..

// exports.productShow = async (req, res) => {
//   const product = await Product.find().populate("categoryId");
//   res.render("admin/productShow", { product });
// };

exports.productShow = async (req, res) => {
  try {
    const product = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          categoryId: 1,
          categoryName: "$category.name",
        },
      },
    ]);
    res.render("admin/productShow", { product: product });
  } catch (err) {
    console.error("Product Show Error:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to load products." });
  }
};

// Show Product Add..

exports.productAddShow = async (req, res) => {
  try {
    const [category, filters] = await Promise.all([
      Category.find({ parentId: null }).lean(),
      Filter.find().lean(),
    ]);

    res.render("admin/productAdd", { category, filters });
  } catch (err) {
    console.error("Error loading product add page:", err);
    res.redirect("/admin/error");
  }
};

// Add Product..

exports.productAdd = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      mainId,
      price,
      filterId,
      description,
      brand,
      offerType,
      offerValue,
      offerExpiresAt,
    } = req.body;

    if (!name || !price || !categoryId || !mainId || !description || !brand) {
      return res.status(400).send("Missing required fields");
    }

    const finalPrice = Number(price);
    const finalOfferValue = offerValue ? Number(offerValue) : null;

    const images = req?.files?.map((file) => file.filename) || [];

    const offer =
      offerType && finalOfferValue
        ? {
            type: offerType,
            value: finalOfferValue,
            expiresAt: offerExpiresAt || null,
          }
        : null;

    await Product.create({
      name,
      image: images,
      categoryId,
      mainId,
      price: finalPrice,
      description,
      brand,
      filters: filterId,
      offer,
    });

    res.redirect("/admin/product");
  } catch (err) {
    console.error("Product Add Error:", err);
    res.status(500).send("Something went wrong!");
  }
};

// Show Product Edit..

// exports.productEditShow = async (req, res) => {
//   const id = req.params.id;
//   const product = await Product.findById(id);
//   const category = await Category.find({ parentId: null });
//   const subCat = await Category.find({ parentId: product.mainId });
//   const filters = await Filter.find();

//   if (!product) {
//     return res.status(400), json({ message: "Product Not Found" });
//   }

//   res.render("admin/productEdit", { product, id, category, filters, subCat });
// };

exports.productEditShow = async (req, res) => {
  try {
    const id = req.params.id;

    const [product] = await Product.aggregate([
      { $match: { _id: mongoose.Types.ObjectId.createFromHexString(id) } },

      // Get sub-categories from mainId
      {
        $lookup: {
          from: "categories",
          localField: "mainId",
          foreignField: "parentId",
          as: "subCategories",
        },
      },
    ]);

    const category = await Category.find({ parentId: null });

    const filters = await Filter.find();

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.render("admin/productEdit", {
      product,
      id,
      category,
      filters,
      subCat: product.subCategories,
    });
  } catch (error) {
    console.error("Error in productEditShow:", error);
    res.status(500).send("Server Error");
  }
};

// Edit Product..

exports.productEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      categoryId,
      mainId,
      price,
      filterId,
      description,
      brand,
      offerType,
      offerExpiresAt,
      offerValue,
    } = req.body;

    const image = req?.files?.map((file) => file.filename) || [];

    const updateData = {
      name,
      categoryId,
      mainId,
      price,
      description,
      brand,
      filters: filterId,
      offer: {
        type: offerType || null,
        value: offerValue || null,
        expiresAt: offerExpiresAt || null,
      },
    };

    if (image.length > 0) {
      updateData.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.redirect("/admin/product");
  } catch (err) {
    console.error("Product Edit Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete Product..

exports.productDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.redirect("/admin/product");
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
