const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");

// ======================================
// PLACE ORDER (Cart Checkout)
// ======================================
const placeOrder = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      paymentMethod,
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide shipping details",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate Stock
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} has only ${item.product.stock} left`,
        });
      }
    }

    const orderItems = [];
    let totalAmount = 0;

    // Deduct Stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -item.quantity,
        },
      });

      orderItems.push({
        product: item.product._id,
        seller: item.product.seller || null,
        quantity: item.quantity,
        price: item.product.price,
      });

      totalAmount += item.product.price * item.quantity;
    }

    const isCOD = paymentMethod === "cod";

    const order = await Order.create({
      user: req.user._id,
      orderItems,

      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        country: country || "India",
      },

      totalAmount,
      paymentMethod: isCOD ? "COD" : "Razorpay",
      // COD orders are confirmed immediately (payment happens on delivery).
      // Online-payment orders stay "pending" until Razorpay verification.
      paymentStatus: "pending",
      status: isCOD ? "confirmed" : "pending",
    });

    // Clear Cart
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// BUY NOW ORDER
// ======================================
// const buyNowOrder = async (req, res) => {
//   try {
//     const {
//       productId,
//       quantity,
//       fullName,
//       phone,
//       address,
//       city,
//       state,
//       pincode,
//       country,
//     } = req.body;

//     if (
//       !productId ||
//       !fullName ||
//       !phone ||
//       !address ||
//       !city ||
//       !state ||
//       !pincode
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields",
//       });
//     }

//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     const qty = Number(quantity || 1);

//     if (product.stock < qty) {
//       return res.status(400).json({
//         success: false,
//         message: `Only ${product.stock} item(s) left in stock`,
//       });
//     }

//     const totalAmount = product.price * qty;

//     const order = await Order.create({
//       user: req.user._id,

//       orderItems: [
//         {
//           product: product._id,
//           quantity: qty,
//           price: product.price,
//         },
//       ],

//       shippingAddress: {
//         fullName,
//         phone,
//         address,
//         city,
//         state,
//         pincode,
//         country: country || "India",
//       },

//       totalAmount,
//       paymentStatus: "pending",
//       status: "pending",
//     });

//     // Reduce Stock
//     await Product.findByIdAndUpdate(product._id, {
//       $inc: {
//         stock: -qty,
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Buy Now order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("BUY NOW ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ======================================
// GET MY ORDERS
// ======================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      paymentStatus: "paid", // Only paid orders
    })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// BUY NOW ORDER
// ======================================
const buyNowOrder = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      fullName,
      phone,
      address,
      city,
      state,
      pincode,
      country,
      paymentMethod,
    } = req.body;

    if (
      !productId ||
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const qty = Number(quantity || 1);

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item(s) left in stock`,
      });
    }

    const totalAmount = product.price * qty;

    const isCOD = paymentMethod === "cod";

    const order = await Order.create({
      user: req.user._id,
      orderItems: [
        {
          product: product._id,
          seller: product.seller || null,
          quantity: qty,
          price: product.price,
        },
      ],
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        state,
        pincode,
        country: country || "India",
      },
      totalAmount,
      paymentMethod: isCOD ? "COD" : "Razorpay",
      paymentStatus: "pending",
      status: isCOD ? "confirmed" : "pending",
    });

    // Reduce stock
    await Product.findByIdAndUpdate(product._id, {
      $inc: {
        stock: -qty,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Buy Now order placed successfully",
      order,
    });
  } catch (error) {
    console.error("========= BUY NOW ERROR =========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================================
// GET SINGLE ORDER
// ======================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate({
        path: "orderItems.product",
        model: "Product",
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// ADMIN - GET ALL ORDERS
// ======================================
const getAllOrders = async (req, res) => {
  try {
    // Show ONLY successful paid orders
    const orders = await Order.find({
      paymentStatus: "paid",
    })
      .populate("user", "name email")
      .populate({
        path: "orderItems.product",
        model: "Product",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// UPDATE ORDER STATUS (ADMIN)
// ======================================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Restock if admin cancels order
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            stock: item.quantity,
          },
        });
      }
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// CANCEL ORDER (USER)
// ======================================
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    if (
      order.status === "shipped" ||
      order.status === "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled now",
      });
    }

    // Restock products
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
        },
      });
    }

    order.status = "cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE ORDER (ADMIN)
// ======================================
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// EXPORTS
// ======================================
module.exports = {
  placeOrder,
  buyNowOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
};
