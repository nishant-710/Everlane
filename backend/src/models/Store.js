const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Store", storeSchema);
