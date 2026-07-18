const Order = require("../model/orderModel");
const Seller = require("../model/sellerModel");

// Helper: get the Seller doc for the logged-in seller user
const getSellerProfile = async (userId) => {
  return Seller.findOne({ user: userId });
};

// =========================
// Get my orders (only the items that belong to me, from any order)
// =========================
const getMyOrders = async (req, res) => {
  try {
    const sellerProfile = await getSellerProfile(req.user._id);

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const orders = await Order.find({
      "orderItems.seller": sellerProfile._id,
    })
      .populate("user", "name email")
      .populate("orderItems.product", "name image")
      .sort({ createdAt: -1 });

    // Project down to only this seller's items + shared order context
    const myOrders = orders.map((order) => {
      const myItems = order.orderItems.filter(
        (item) => item.seller?.toString() === sellerProfile._id.toString()
      );

      const mySubtotal = myItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        _id: order._id,
        customer: order.user,
        shippingAddress: order.shippingAddress,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: myItems,
        mySubtotal,
        isPartOfMultiSellerOrder: order.orderItems.length !== myItems.length,
      };
    });

    res.status(200).json({
      success: true,
      orders: myOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update the status of my item within an order
// =========================
const updateMyItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const sellerProfile = await getSellerProfile(req.user._id);

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const item = order.orderItems.id(itemId);

    if (!item || item.seller?.toString() !== sellerProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "This item does not belong to your store",
      });
    }

    item.itemStatus = status;

    // If every item in the order now shares the same status, reflect that
    // on the top-level order status too (keeps the customer-facing view sane)
    const allSame = order.orderItems.every((i) => i.itemStatus === status);
    if (allSame) {
      order.status = status;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item status updated",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// My earnings summary (ledger, not a real payout)
// =========================
const getMyEarnings = async (req, res) => {
  try {
    const sellerProfile = await getSellerProfile(req.user._id);

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const orders = await Order.find({
      "orderItems.seller": sellerProfile._id,
      paymentStatus: "paid",
    });

    let grossSales = 0;
    let deliveredSales = 0;
    let pendingSales = 0;

    for (const order of orders) {
      for (const item of order.orderItems) {
        if (item.seller?.toString() !== sellerProfile._id.toString())
          continue;

        const lineTotal = item.price * item.quantity;
        grossSales += lineTotal;

        if (item.itemStatus === "delivered") {
          deliveredSales += lineTotal;
        } else if (item.itemStatus !== "cancelled") {
          pendingSales += lineTotal;
        }
      }
    }

    const commissionRate = sellerProfile.commissionRate ?? 10;
    const commissionAmount = (grossSales * commissionRate) / 100;
    const netEarnings = grossSales - commissionAmount;

    res.status(200).json({
      success: true,
      earnings: {
        grossSales,
        deliveredSales,
        pendingSales,
        commissionRate,
        commissionAmount,
        netEarnings,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyOrders,
  updateMyItemStatus,
  getMyEarnings,
};
