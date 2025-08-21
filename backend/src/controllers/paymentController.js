const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const Cart = require("../models/Cart");
const crypto = require("crypto");
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const mongoose = require("mongoose");

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { selectedDetailsId } = req.body;

    // const cart = await Cart.findOne({ userId }).populate("items.productId");
    // if (!cart || cart.items.length === 0) {
    //   return res.status(400).json({ success: false, message: "Cart is empty" });
    // }

    const [cart] = await Cart.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId.createFromHexString(userId) },
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          items: {
            $push: {
              productId: "$productDetails._id",
              quantity: "$items.quantity",
              price: "$productDetails.price",
            },
          },
        },
      },
    ]);

    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      const itemTotal = price * quantity;
      totalAmount += itemTotal;
      return {
        productId: item.productId,
        quantity,
        price,
      };
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    razorpayInstance.orders.create(options, async (err, order) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Razorpay order creation failed" });
      }

      const newOrder = new Order({
        userId,
        selectedDetailsId,
        items: orderItems,
        amount: totalAmount,
        status: "pending",
        razorpay_order_id: order.id,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        msg: "Order created",
        order_id: order.id,
        amount: totalAmount,
        currency: "INR",
        key_id: RAZORPAY_ID_KEY,
      });
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    // 1. Signature verification..
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
    //

    const order = await Order.findOne({ razorpay_order_id, userId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const transaction = new Transaction({
      userId,
      orderId: order._id,
      razorpay_payment_id,
      razorpay_signature,
      amount: order.amount,
      status: "pending",
    });

    // await transaction.save();

    // order.status = "paid";
    // await order.save();

    // await Cart.findOneAndDelete({ userId });

    await Promise.all([
      transaction.save(),
      Order.updateOne({ _id: order._id }, { status: "paid" }),
      Cart.deleteOne({ userId }),
    ]);

    res
      .status(200)
      .json({ success: true, message: "Payment verified and order completed" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
