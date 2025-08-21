const express = require("express");
const categoryController = require("../controllers/categoryController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/category", categoryController.categoryShow);
router.get("/categoryAdd", categoryController.categoryAddShow);
router.post(
  "/categoryAdd",
  uploadMiddleware.array("image"),
  categoryController.categoryAdd
);
router.get("/category/:id/edit", categoryController.categoryEditShow);
router.post(
  "/category/:id/edit",
  uploadMiddleware.array("image"),
  categoryController.categoryEdit
);
router.post("/category/:id/delete", categoryController.deleteCategory);

module.exports = router;
