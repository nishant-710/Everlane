const Category = require("../models/Category");
const Product = require("../models/Product");
const Slider = require("../models/Slider");
const mongoose = require("mongoose");

// Show Category..

// exports.categoryShow = async (req, res) => {
//   const category = await Category.find().populate("parentId");
//   res.render("admin/categoryShow", { category });
// };

exports.categoryShow = async (req, res) => {
  try {
    const category = await Category.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "parentId",
          foreignField: "_id",
          as: "parentData",
        },
      },
      {
        $unwind: {
          path: "$parentData",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.render("admin/categoryShow", { category });
  } catch (err) {
    console.error("Category Show Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to load categories",
    });
  }
};

// Show Category Add..

exports.categoryAddShow = async (req, res) => {
  try {
    const categories = await Category.find({ parentId: null }).lean();
    res.render("admin/categoryAdd", { categories });
  } catch (err) {
    console.error("Category Add Show Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to load categories.",
    });
  }
};

// Add Category..

exports.categoryAdd = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const image =
      req.files && req.files.length > 0
        ? req.files.map((file) => file.filename)
        : [];

    await Category.create({
      name: name.trim(),
      image,
      parentId: parentId || null,
    });

    res.redirect("/admin/category");
  } catch (err) {
    console.error("Category Add Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to add category.",
    });
  }
};

// Show Category Edit..

exports.categoryEditShow = async (req, res) => {
  try {
    const { id } = req.params;

    const [category, categories] = await Promise.all([
      Category.findById(id).lean(),
      Category.find({ parentId: null }).lean(),
    ]);

    if (!category) {
      return res
        .status(404)
        .render("admin/error", { message: "Category Not Found" });
    }

    res.render("admin/categoryEdit", { category, id, categories });
  } catch (err) {
    console.error("Category Edit Show Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while loading the category.",
    });
  }
};

// Edit Category..

exports.categoryEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;
    const image = req?.files?.map((file) => file.filename);

    if (!name || !id) {
      return res.status(400).json({ message: "Name and ID are required." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    category.name = name;

    if (parentId) {
      category.parentId = parentId;
    }

    if (image?.length > 0) {
      category.image = image;
    }

    await category.save();

    res.redirect("/admin/category");
  } catch (err) {
    console.error("Category Edit Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to update category.",
    });
  }
};

// Delete Category..

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    await Category.findByIdAndDelete(id);

    const subcategories = await Category.find({ parentId: id });

    if (subcategories.length > 0) {
      const subcategoryIds = subcategories.map((cat) => cat._id);

      await Category.deleteMany({ parentId: id });

      await Promise.all([
        Product.deleteMany({ categoryId: { $in: subcategoryIds } }),
        Slider.deleteMany({ categoryId: { $in: subcategoryIds } }),
      ]);
    }

    await Promise.all([
      Product.deleteMany({ categoryId: id }),
      Slider.deleteMany({ categoryId: id }),
    ]);

    res.redirect("/admin/category");
  } catch (err) {
    console.error("Delete Category Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to delete category.",
    });
  }
};
