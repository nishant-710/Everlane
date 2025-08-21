const mongoose = require("mongoose");
const Slider = require("../models/Slider");
const Category = require("../models/Category");
const User = require("../models/User");
const Filter = require("../models/Filter");
const Store = require("../models/Store");
const Transaction = require("../models/Transaction");
const Cart = require("../models/Cart");
const Shipping_detail = require("../models/Shipping_detail");
const Product = require("../models/Product");
const Size = require("../models/Size");
const Color = require("../models/Color");

// Dashboard..

exports.dashboardShow = async (req, res) => {
  res.render("admin/dashboard");
};

// Logout..

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    res.status(200).json({ redirect: "/login", message: "Logged out" });
  } catch (err) {
    console.error("Logout Error:", err.message);
    res.status(500).json({ message: "Logout failed" });
  }
};

// Settings..

exports.settingsShow = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email mobile");

    if (!user) {
      return res
        .status(404)
        .render("admin/error", { message: "User not found" });
    }

    res.render("admin/settings", { user });
  } catch (err) {
    console.error("Settings Error:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to load settings." });
  }
};

// Edit Profile..

exports.editProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User updated", redirect: "/admin/settings" });
  } catch (err) {
    console.error("Edit Profile Error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete Account..

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res
        .status(400)
        .json({ message: "User not found or already deleted" });
    }

    res.clearCookie("token");
    return res
      .status(200)
      .json({ message: "Account deleted", redirect: "/login" });
  } catch (err) {
    console.error("Delete Account Error:", err.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Get Users..

exports.usersShow = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("name email mobile");
    res.render("admin/usersShow", { users });
  } catch (err) {
    console.error("Fetch Users Error:", err.message);
    res.status(500).send("Something went wrong");
  }
};

// Delete Users..

exports.usersDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    await Promise.all([
      user.deleteOne(),
      Cart.deleteMany({ userId: id }),
      Shipping_detail.deleteMany({ userId: id }),
    ]);

    return res.redirect("/admin/users");
  } catch (err) {
    console.error("Delete User Error:", err.message);
    return res.status(500).send("Something went wrong");
  }
};

// Slider..

exports.sliderShow = async (req, res) => {
  try {
    const slider = await Slider.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.render("admin/sliderShow", { slider });
  } catch (error) {
    console.error("Slider Show Error:", error.message);
    res.render("admin/error", {
      message: "Failed to load sliders",
      error,
    });
  }
};

// Show Slider Add..

exports.sliderAddShow = async (req, res) => {
  try {
    const category = await Category.find({ parentId: { $ne: null } });
    res.render("admin/sliderAdd", { category });
  } catch (error) {
    console.error("Slider Add Show Error:", error.message);
    res.render("admin/error", {
      message: "Failed to load categories for slider",
      error,
    });
  }
};

// Add Slider..

exports.sliderAdd = async (req, res) => {
  try {
    const { title, description, categoryId, productId } = req.body;

    const [category, product] = await Promise.all([
      Category.findById(categoryId),
      Product.findById(productId),
    ]);

    if (!category || !product) {
      return res.render("admin/error", {
        message: "Invalid category or product selection",
        error: {},
      });
    }

    const imageWeb = req.files?.imageWeb?.length
      ? req.files.imageWeb.map((file) => file.filename)
      : product.image;

    const imageMobile = req.files?.imageMobile?.length
      ? req.files.imageMobile.map((file) => file.filename)
      : product.image;

    await Slider.create({
      title,
      description,
      imageWeb,
      imageMobile,
      mainId: category.parentId,
      categoryId,
      productId,
    });

    res.redirect("/admin/slider");
  } catch (error) {
    console.error("Slider Add Error:", error.message);
    res.render("admin/error", {
      message: "Failed to add slider",
      error,
    });
  }
};

// Show Slider Edit..

exports.sliderEditShow = async (req, res) => {
  try {
    const { id } = req.params;

    const [category, slider] = await Promise.all([
      Category.find({ parentId: { $ne: null } }),
      Slider.findById(id),
    ]);

    if (!slider) {
      return res.render("admin/error", {
        message: "Slider not found",
        error: {},
      });
    }

    res.render("admin/sliderEdit", { slider, id, category });
  } catch (error) {
    console.error("Slider Edit Show Error:", error.message);
    res.render("admin/error", {
      message: "Failed to load slider edit page",
      error,
    });
  }
};

// Edit Slider..

exports.sliderEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, productId } = req.body;

    const slider = await Slider.findById(id);

    if (!slider) {
      return res.render("admin/error", {
        message: "Slider not found",
        error: {},
      });
    }

    const imageWeb = req.files?.imageWeb?.length
      ? req.files.imageWeb.map((file) => file.filename)
      : slider.imageWeb;

    const imageMobile = req.files?.imageMobile?.length
      ? req.files.imageMobile.map((file) => file.filename)
      : slider.imageMobile;

    slider.title = title;
    slider.description = description;
    slider.categoryId = categoryId;
    slider.productId = productId;
    slider.imageWeb = imageWeb;
    slider.imageMobile = imageMobile;

    await slider.save();

    res.redirect("/admin/slider");
  } catch (error) {
    console.error("Slider Edit Error:", error.message);
    res.render("admin/error", {
      message: "Failed to update slider",
      error,
    });
  }
};

// Delete Slider..

exports.sliderDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findByIdAndDelete(id);

    if (!slider) {
      return res.render("admin/error", {
        message: "Slider not found for deletion",
        error: {},
      });
    }

    res.redirect("/admin/slider");
  } catch (error) {
    console.error("Slider Delete Error:", error.message);
    res.render("admin/error", {
      message: "Failed to delete slider",
      error,
    });
  }
};

// Filters..

exports.filtersShow = async (req, res) => {
  try {
    const filters = await Filter.find();
    res.render("admin/filtersShow", { filters });
  } catch (err) {
    console.error("Error loading filters:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to load filters." });
  }
};

// Show Filters Add..

exports.filtersAddShow = async (req, res) => {
  try {
    res.render("admin/filtersAdd");
  } catch (err) {
    console.error("Error loading filter add page:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to load add filter page." });
  }
};

// Add Filters..

exports.filtersAdd = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res
        .status(400)
        .render("admin/error", { message: "Filter name is required." });
    }

    await Filter.create({ name: name.trim() });

    res.redirect("/admin/filters");
  } catch (err) {
    console.error("Add Filter Error:", err.message);
    res.status(500).render("admin/error", { message: "Failed to add filter." });
  }
};

// Show Filters Edit..

exports.filtersEditShow = async (req, res) => {
  try {
    const { id } = req.params;

    const filter = await Filter.findById(id);

    if (!filter) {
      return res.status(404).render("admin/error", {
        message: "Filter not found",
      });
    }

    res.render("admin/filtersEdit", { filter, id });
  } catch (err) {
    console.error("Error showing filter edit page:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while loading the filter.",
    });
  }
};

// Edit Filters..

exports.filtersEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const filter = await Filter.findById(id);

    if (!filter) {
      return res.status(404).render("admin/error", {
        message: "Filter not found",
      });
    }

    filter.name = name;
    await filter.save();

    res.redirect("/admin/filters");
  } catch (err) {
    console.error("Edit Filter Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while editing the filter.",
    });
  }
};

// Delete Filters..

exports.filtersDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const filter = await Filter.findByIdAndDelete(id);

    if (!filter) {
      return res.status(404).render("admin/error", {
        message: "Filter not found",
      });
    }

    res.redirect("/admin/filters");
  } catch (err) {
    console.error("Delete Filter Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while deleting the filter.",
    });
  }
};

// Show Stores..

exports.storesShow = async (req, res) => {
  try {
    const stores = await Store.find();
    res.render("admin/storesShow", { stores });
  } catch (err) {
    console.error("Error loading stores:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to load stores.",
    });
  }
};

// Show Stores Add..

exports.storesAddShow = async (req, res) => {
  try {
    res.render("admin/storesAdd");
  } catch (err) {
    console.error("Error loading store add page:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to load store creation page.",
    });
  }
};

// Add Stores..

exports.storesAdd = async (req, res) => {
  try {
    const { name, location } = req.body;
    const image = req?.file?.filename;

    if (!name || !location) {
      return res.status(400).render("admin/error", {
        message: "Name & Location are required.",
      });
    }

    await Store.create({ name, image, location });

    res.redirect("/admin/stores");
  } catch (err) {
    console.error("Error adding store:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while adding store.",
    });
  }
};

// Show Stores Edit..

exports.storesEditShow = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store) {
      return res
        .status(404)
        .render("admin/error", { message: "Store not found" });
    }
    res.render("admin/storesEdit", { store, id });
  } catch (err) {
    console.error("Edit Show Error:", err.message);
    res.status(500).render("admin/error", { message: "Something went wrong." });
  }
};

// Edit Stores..

exports.storesEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    const image = req?.file?.filename;

    const store = await Store.findById(id);
    if (!store) {
      return res
        .status(404)
        .render("admin/error", { message: "Store not found" });
    }

    store.name = name;
    store.location = location;

    if (image) {
      store.image = image;
    }

    await store.save();
    res.redirect("/admin/stores");
  } catch (err) {
    console.error("Edit Store Error:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to update store." });
  }
};

// Delete Stores..

exports.storesDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).render("admin/error", {
        message: "Store not found or already deleted.",
      });
    }

    await store.deleteOne();
    res.redirect("/admin/stores");
  } catch (err) {
    console.error("Delete Store Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Failed to delete store.",
    });
  }
};

// Orders..

exports.orders = async (req, res) => {
  try {
    const transactions = await Transaction.aggregate([
      { $match: { status: "pending" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "orderId",
        },
      },
      { $unwind: "$orderId" },
      {
        $unwind: {
          path: "$orderId.items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderId.items.productId",
          foreignField: "_id",
          as: "orderId.items.productId",
        },
      },
      {
        $unwind: {
          path: "$orderId.items.productId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          orderId: {
            $first: {
              _id: "$orderId._id",
              items: [],
            },
          },
          items: {
            $push: {
              productId: "$orderId.items.productId",
              quantity: "$orderId.items.quantity",
            },
          },
        },
      },
      {
        $addFields: {
          orderId: {
            $mergeObjects: ["$orderId", { items: "$items" }],
          },
        },
      },
      {
        $project: {
          items: 0,
        },
      },
    ]);

    res.render("admin/orders", { transactions });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.render("admin/error", {
      message: "Something went wrong while fetching pending orders.",
      error,
    });
  }
};

// Approve..

exports.approve = async (req, res) => {
  try {
    const paymentId = req.params.aid;

    const result = await Transaction.updateOne(
      { _id: mongoose.Types.ObjectId.createFromHexString(paymentId) },
      { $set: { status: "approved" } }
    );

    if (result.matchedCount === 0) {
      return res.render("admin/error", {
        message: "Transaction not found",
        error: { status: 404 },
      });
    }

    res.redirect("/admin/orders");
  } catch (error) {
    console.error("Approve Error:", error);
    res.render("admin/error", {
      message: "Failed to approve payment",
      error,
    });
  }
};

// Reject..

exports.reject = async (req, res) => {
  try {
    const paymentId = req.params.aid;

    const result = await Transaction.updateOne(
      { _id: mongoose.Types.ObjectId.createFromHexString(paymentId) },
      { $set: { status: "rejected" } }
    );

    if (result.matchedCount === 0) {
      return res.render("admin/error", {
        message: "Transaction not found",
        error: { status: 404 },
      });
    }

    res.redirect("/admin/orders");
  } catch (error) {
    console.error("Reject Error:", error);
    res.render("admin/error", {
      message: "Failed to reject payment",
      error,
    });
  }
};

// Get Sub Categories for AJAX..

exports.getSub = async (req, res) => {
  try {
    const subCategories = await Category.find({ parentId: req.params.mainId });
    res.json(subCategories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

// Get Products for AJAX..

exports.getProducts = async (req, res) => {
  try {
    const product = await Product.find({ categoryId: req.params.categoryId });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Size..

exports.sizeShow = async (req, res) => {
  try {
    const size = await Size.find();
    res.render("admin/sizeShow", { size });
  } catch (err) {
    console.error("Error loading size:", err.message);
    res.status(500).render("admin/error", { message: "Failed to load size." });
  }
};

// Show Size Add..

exports.sizeAddShow = async (req, res) => {
  try {
    res.render("admin/sizeAdd");
  } catch (err) {
    console.error("Error loading size add page:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to load add size page." });
  }
};

// Add Size..

exports.sizeAdd = async (req, res) => {
  try {
    const { name, symbol } = req.body;

    if (!name || name.trim() === "" || !symbol || symbol.trim() === "") {
      return res.status(400).render("admin/error", {
        message: "size name and symbol is required.",
      });
    }

    await Size.create({ name: name.trim(), symbol: symbol.trim() });

    res.redirect("/admin/size");
  } catch (err) {
    console.error("Add size Error:", err.message);
    res.status(500).render("admin/error", { message: "Failed to add size." });
  }
};

// Show Size Edit..

exports.sizeEditShow = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await Size.findById(id);

    if (!size) {
      return res.status(404).render("admin/error", {
        message: "Size not found",
      });
    }

    res.render("admin/sizeEdit", { size, id });
  } catch (err) {
    console.error("Error showing size edit page:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while loading the size.",
    });
  }
};

// Edit Size..

exports.sizeEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, symbol } = req.body;

    const size = await Size.findById(id);

    if (!size) {
      return res.status(404).render("admin/error", {
        message: "size not found",
      });
    }

    size.name = name;
    size.symbol = symbol;
    await size.save();

    res.redirect("/admin/size");
  } catch (err) {
    console.error("Edit size Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while editing the size.",
    });
  }
};

// Delete Size..

exports.sizeDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await Size.findByIdAndDelete(id);

    if (!size) {
      return res.status(404).render("admin/error", {
        message: "size not found",
      });
    }

    res.redirect("/admin/size");
  } catch (err) {
    console.error("Delete Size Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while deleting the size.",
    });
  }
};

// Color..

exports.colorShow = async (req, res) => {
  try {
    const color = await Color.find();
    res.render("admin/colorShow", { color });
  } catch (err) {
    console.error("Error loading color:", err.message);
    res.status(500).render("admin/error", { message: "Failed to load color." });
  }
};

// Show Color Add..

exports.colorAddShow = async (req, res) => {
  try {
    res.render("admin/colorAdd");
  } catch (err) {
    console.error("Error loading color add page:", err.message);
    res
      .status(500)
      .render("admin/error", { message: "Failed to load add color page." });
  }
};

// Add Color..

exports.colorAdd = async (req, res) => {
  try {
    const { name, symbol } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).render("admin/error", {
        message: "color name is required.",
      });
    }

    await Color.create({ name: name.trim() });

    res.redirect("/admin/color");
  } catch (err) {
    console.error("Add color Error:", err.message);
    res.status(500).render("admin/error", { message: "Failed to add color." });
  }
};

// Show Color Edit..

exports.colorEditShow = async (req, res) => {
  try {
    const { id } = req.params;

    const color = await Color.findById(id);

    if (!color) {
      return res.status(404).render("admin/error", {
        message: "color not found",
      });
    }

    res.render("admin/colorEdit", { color, id });
  } catch (err) {
    console.error("Error showing color edit page:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while loading the color.",
    });
  }
};

// Edit Color..

exports.colorEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const color = await Color.findById(id);

    if (!color) {
      return res.status(404).render("admin/error", {
        message: "color not found",
      });
    }

    color.name = name;
    await color.save();

    res.redirect("/admin/color");
  } catch (err) {
    console.error("Edit color Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while editing the color.",
    });
  }
};

// Delete Color..

exports.colorDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const color = await Color.findByIdAndDelete(id);

    if (!color) {
      return res.status(404).render("admin/error", {
        message: "color not found",
      });
    }

    res.redirect("/admin/color");
  } catch (err) {
    console.error("Delete color Error:", err.message);
    res.status(500).render("admin/error", {
      message: "Something went wrong while deleting the color.",
    });
  }
};
