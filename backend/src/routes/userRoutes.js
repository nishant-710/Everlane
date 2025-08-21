const express = require("express");
const userController = require("../controllers/userController");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.get("/me", (req, res) => {
  res.json({ success: true, user: req.user });
});
router.post("/editProfile", userController.editProfile);
router.post("/logout", userController.logout);
router.get("/cart", userController.cart);
router.post("/cart/add", userController.addToCart);
router.post("/cart/delete", userController.cartDelete);
router.post("/cart/decrease", userController.decreaseQuantity);
router.post("/cart/increase", userController.increaseQuantity);
router.get("/getShippingDetails", userController.getShippingDetails);
router.post("/shippingDetails", userController.shippingDetails);
router.post("/deleteShippingDetails", userController.deleteShippingDetails);
router.post("/editShippingDetails", userController.editShippingDetails);
router.post("/createOrder", paymentController.createOrder);
router.post("/verifyPayment", paymentController.verifyPayment);
router.post("/myOrders", userController.myOrders);
router.post("/ratings", userController.ratings);

module.exports = router;
