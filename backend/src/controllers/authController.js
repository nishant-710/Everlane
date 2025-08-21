const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation } = require("../utils/authValidation");
const mongoose = require("mongoose");

// Register
exports.register = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
      });

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User Already Exists" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash, loginMethod: "normal" });

    return res
      .status(201)
      .json({ message: "User Register Successful", redirect: "/login" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// Google Login
exports.googleLogin = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user)
      user = await User.create({
        email,
        loginMethod: "google",
        password: null,
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    return res.redirect("/user/dashboard");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Google login failed" });
  }
};

// Login Page
exports.loginShow = (req, res) => {
  res.render("admin/login");
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });

    user.token = token;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      token,
      redirect: user.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Login failed" });
  }
};
