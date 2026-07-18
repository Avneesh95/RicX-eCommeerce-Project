const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: "India",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },

    role: {
      type: String,
      enum: ["user", "seller", "admin", "superAdmin"],
      default: "user",
    },

    // ===== OTP for Forgot Password =====
    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    // ===== Addresses =====
    addresses: [addressSchema],

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ===== Granular Admin Permissions =====
    permissions: {
      products: { type: Boolean, default: false },
      orders: { type: Boolean, default: false },
      users: { type: Boolean, default: false },
      coupons: { type: Boolean, default: false },
      reviews: { type: Boolean, default: false },
      dashboard: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);