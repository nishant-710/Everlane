const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: null },
    mobile: { type: String, default: null },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.loginMethod === "normal";
      },
    },
    token: String,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    loginMethod: {
      type: String,
      enum: ["normal", "google"],
      default: "normal",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
