const Product = require("../models/Product");
const Category = require("../models/Category");
const Slider = require("../models/Slider");
const Filter = require("../models/Filter");
const Store = require("../models/Store");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Shipping_detail = require("../models/Shipping_detail");
const Order = require("../models/Order");
const Rating = require("../models/Rating");
const mongoose = require("mongoose");

// Dashboard..

exports.dashboard = async (req, res) => {
  try {
    const categories = await Category.find({ parentId: null }).lean();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      categories,
    });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
      error: error.message,
    });
  }
};

// Edit Profile..

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.name = name.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile.",
      error: error.message,
    });
  }
};

// Logout..

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed.",
      error: error.message,
    });
  }
};

// Products..

exports.products = async (req, res) => {
  try {
    const { categoryId = null, mainId = null, filterId } = req.body;

    let query = {};
    if (filterId) query.filters = filterId;
    if (categoryId) query.categoryId = categoryId;
    if (mainId) query.mainId = mainId;

    const products = await Product.find(query);

    const favouritesFilter = await Filter.findOne({
      name: { $regex: /^fav(ou)?r?i?te?s?$/i },
    });

    let fav = [];

    if (favouritesFilter) {
      const favQuery = {
        filters: favouritesFilter._id,
      };
      if (categoryId) favQuery.categoryId = categoryId;
      if (mainId) favQuery.mainId = mainId;

      fav = await Product.find(favQuery);
    }

    return res.status(200).json({ success: true, products, fav });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get each product details..

exports.productDetails = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Valid productId is required." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Product details fetched successfully.",
      product,
    });
  } catch (err) {
    console.error("Error fetching product details:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Sub Categories..

exports.subCategories = async (req, res) => {
  try {
    const { mainId } = req.body;

    let query = {};
    if (mainId) {
      query.parentId = mainId;
    } else {
      query.parentId = { $ne: null };
    }

    const subCategories = await Category.find(query);

    return res.status(200).json({
      success: true,
      message: "Sub-categories fetched successfully.",
      subCategories,
    });
  } catch (err) {
    console.error("Error fetching sub-categories:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Sliders..

exports.sliders = async (req, res) => {
  try {
    const { categoryId, mainId } = req.body;

    let query = {};

    if (categoryId) {
      query.categoryId =
        mongoose.Types.ObjectId.createFromHexString(categoryId);
    }

    if (mainId) {
      query.mainId = mongoose.Types.ObjectId.createFromHexString(mainId);
    }

    const sliders = await Slider.aggregate([
      { $match: query },

      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Sliders fetched Successfully..",
      sliders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Filters..

exports.filters = async (req, res) => {
  try {
    const filters = await Filter.find();

    return res.status(200).json({
      success: true,
      message: "Filters fetched successfully.",
      filters,
    });
  } catch (err) {
    console.error("Error fetching filters:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

// Stores..

exports.stores = async (req, res) => {
  try {
    const stores = await Store.find();
    return res.status(200).json({
      success: true,
      message: "Stores fetched Successfully..",
      stores,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cart..

exports.cart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId, { password: 0, __v: 0 });

    const [cart] = await Cart.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          items: {
            $push: {
              productId: "$productDetails._id",
              name: "$productDetails.name",
              price: "$productDetails.price",
              image: "$productDetails.image",
              quantity: "$items.quantity",
              size: "$items.size",
              color: "$items.color",
              _id: "$items._id",
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      cart,
      user,
    });
  } catch (err) {
    console.error("Cart Fetch Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Add to Cart..

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "ProductId is required." });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, size, color }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.productId == productId &&
          item.size == size &&
          item.color == color
      );

      if (existingItem) {
        existingItem.quantity += parseInt(quantity);
      } else {
        cart.items.push({ productId, quantity, size, color });
      }

      await cart.save();
    }

    return res.status(201).json({
      success: true,
      message: "Added to Cart Successfully.",
      cart,
    });
  } catch (err) {
    console.error("Add to Cart Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Cart item..

exports.cartDelete = async (req, res) => {
  const userId = req.user.id;
  const itemId = req.body.itemId;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Item deleted successfully.." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Decrease Quantity..

exports.decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "itemId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item._id == itemId);

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];
    let itemRemoved = false;

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
      itemRemoved = true;
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: itemRemoved ? "Item removed from cart" : "Quantity decreased",
      quantity: itemRemoved ? 0 : item.quantity,
    });
  } catch (err) {
    console.error("Error in decreaseQuantity:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Increase Quantity..

exports.increaseQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "itemId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find((item) => item._id == itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    item.quantity += 1;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity increased",
      quantity: item.quantity,
    });
  } catch (err) {
    console.error("Error in increaseQuantity:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Shipping Details..

exports.shippingDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      email,
      mobile,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      pincode,
    } = req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !address_line_1 ||
      !city ||
      !state ||
      !country ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    const details = await Shipping_detail.create({
      userId,
      name,
      email,
      mobile,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      pincode,
    });

    return res.status(201).json({
      success: true,
      message: "Shipping address saved successfully.",
      details,
    });
  } catch (err) {
    console.error("Shipping Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Get User Shipping Details..

exports.getShippingDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const details = await Shipping_detail.find({ userId });

    res.json({
      success: true,
      details,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete User Shipping Details..

exports.deleteShippingDetails = async (req, res) => {
  try {
    const { id } = req.body;
    const details = await Shipping_detail.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Details Deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Edit Shipping Details..

exports.editShippingDetails = async (req, res) => {
  try {
    const { id } = req.body;

    const {
      name,
      email,
      mobile,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      pincode,
    } = req.body;

    const updated = await Shipping_detail.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
        address_line_1,
        address_line_2,
        city,
        state,
        country,
        pincode,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shipping address updated successfully.",
      details: updated,
    });
  } catch (err) {
    console.error("Shipping Details Update Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// My Orders..

exports.myOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId.createFromHexString(userId),
          status: "paid",
        },
      },
      {
        $unwind: {
          path: "$items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "items.product",
        },
      },
      {
        $unwind: {
          path: "$items.product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          status: { $first: "$status" },
          amount: { $first: "$amount" },
          createdAt: { $first: "$createdAt" },
          items: {
            $push: {
              productId: "$items.productId",
              productName: "$items.product.name",
              quantity: "$items.quantity",
              price: "$items.price",
              _id: "$items._id",
            },
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "My orders fetched Successfully..",
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rating..

exports.ratings = async (req, res) => {
  try {
    const { productId, stars } = req.body;
    const userId = req.user.id;

    if (!stars || stars < 1 || stars > 5) {
      return res
        .status(400)
        .json({ message: "Invalid rating. Must be 1-5 stars." });
    }

    const existingRating = await Rating.findOne({ productId, userId });

    if (existingRating) {
      existingRating.stars = stars;
      await existingRating.save();
    } else {
      await Rating.create({ productId, userId, stars });
    }

    const [result] = await Rating.aggregate([
      {
        $match: {
          productId: mongoose.Types.ObjectId.createFromHexString(productId),
        },
      },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$stars" },
        },
      },
    ]);

    const average = result?.avgRating || 0;
    const rounded = Math.round(average * 2) / 2;

    await Product.findByIdAndUpdate(productId, {
      stars: rounded,
    });

    res.json({ message: "Rating submitted successfully.", stars: rounded });
  } catch (err) {
    console.error("Rating Error:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Search..

exports.search = async (req, res) => {
  try {
    const search = req.query.search || "";

    const products = await Product.find({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
