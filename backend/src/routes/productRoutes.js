const express = require("express");
const productController = require("../controllers/productController");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/product", productController.productShow);
router.get("/productAdd", productController.productAddShow);
router.post(
  "/productAdd",
  uploadMiddleware.array("image"),
  productController.productAdd
);
router.get("/product/:id/edit", productController.productEditShow);
router.post(
  "/product/:id/edit",
  uploadMiddleware.array("image"),
  productController.productEdit
);
router.post("/product/:id/delete", productController.productDelete);

module.exports = router;
