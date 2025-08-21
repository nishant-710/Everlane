const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 0.5,
      max: 5,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Rating", ratingSchema);
