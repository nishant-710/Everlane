const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/dashboard", userController.dashboard);
router.get("/filters", userController.filters);
router.get("/stores", userController.stores);
router.post("/subCategories", userController.subCategories);
router.post("/productDetails", userController.productDetails);
router.post("/products", userController.products);
router.post("/sliders", userController.sliders);
router.get("/search", userController.search);

module.exports = router;
