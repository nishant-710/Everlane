const mongoose = require("mongoose");

const filterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Filter", filterSchema);
