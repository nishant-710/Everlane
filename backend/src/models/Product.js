const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: [{ type: String, default: null }],
    price: { type: Number, required: true },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    mainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    filters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Filter",
        required: false,
      },
    ],
    sizes: {
      type: [String],
      default: ["S", "M", "L", "XL"],
    },
    colors: {
      type: [String],
      default: ["Red", "Black", "Blue", "Pink"],
    },
    stars: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    offer: {
      type: {
        type: String,
        enum: ["flat", "percent"],
        default: null,
      },
      value: {
        type: Number,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Product", productSchema);
