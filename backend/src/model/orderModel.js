const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seller",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        itemStatus: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "packed",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled",
          ],
          default: "pending",
        },
      },
    ],

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "India",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
  type: String,
  enum: [
    "pending",
    "confirmed",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ],
  default: "pending",
},

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  couponCode: {
      type: String,
      default: null,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);