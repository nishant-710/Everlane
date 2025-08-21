const express = require("express");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const publicRoutes = require("./publicRoutes");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use("/", authRoutes);
router.use("/user", publicRoutes);
router.use("/admin", authMiddleware, roleMiddleware(["admin"]), adminRoutes);
router.use("/admin", authMiddleware, roleMiddleware(["admin"]), categoryRoutes);
router.use("/admin", authMiddleware, roleMiddleware(["admin"]), productRoutes);
router.use("/user", authMiddleware, roleMiddleware(["user"]), userRoutes);
router.get("/", authMiddleware, (req, res) => {
  if (req.user.role == "admin") {
    return res.redirect("/admin/dashboard");
  } else {
    return res.redirect("/user/dashboard");
  }
});

module.exports = router;
