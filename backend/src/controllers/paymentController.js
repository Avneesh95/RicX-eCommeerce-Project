const razorpay = require("../config/razorpay");
const Order = require("../model/orderModel");
const crypto = require("crypto");

// =========================
// CREATE PAYMENT ORDER
// =========================
const createPaymentOrder = async (req, res) => {
  try {
    const { orderIds } = req.body;

    console.log("Received Order IDs:", orderIds);

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs are required",
      });
    }

    // For Buy Now there is only one order
    // For Cart there may be multiple orders
    const orders = await Order.find({
      _id: { $in: orderIds },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }

    // Calculate total amount
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save Razorpay Order ID in every order
    for (const order of orders) {
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
    }

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// VERIFY PAYMENT
// =========================
const Product = require("../model/productModel");

const verifyPayment = async (req, res) => {
  try {
    const {
      orderIds,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs are required",
      });
    }

    const orders = await Order.find({
      _id: { $in: orderIds },
    });

    if (orders.length !== orderIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more orders not found",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // =========================
    // PAYMENT FAILED
    // =========================
    if (generatedSignature !== razorpay_signature) {

      // Restore stock
      for (const order of orders) {
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(
            item.product,
            {
              $inc: {
                stock: item.quantity,
              },
            }
          );
        }
      }

      // Delete temporary orders
      await Order.deleteMany({
        _id: {
          $in: orderIds,
        },
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // =========================
    // PAYMENT SUCCESS
    // =========================
    await Order.updateMany(
      {
        _id: {
          $in: orderIds,
        },
      },
      {
        $set: {
          paymentStatus: "paid",
          status: "confirmed",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// CANCEL PENDING ORDER (Razorpay checkout abandoned/closed)
// =========================
const cancelPendingOrder = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs are required",
      });
    }

    const orders = await Order.find({
      _id: { $in: orderIds },
      user: req.user._id,
      paymentStatus: "pending",
    });

    if (orders.length === 0) {
      // Already paid, already cancelled, or not this user's order — nothing to do.
      return res.status(200).json({
        success: true,
        message: "Nothing to cancel",
      });
    }

    // Restore stock for every item in these still-unpaid orders
    for (const order of orders) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await Order.deleteMany({
      _id: { $in: orders.map((o) => o._id) },
    });

    return res.status(200).json({
      success: true,
      message: "Order cancelled and stock restored",
    });
  } catch (error) {
    console.error("CANCEL PENDING ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  cancelPendingOrder,
};
