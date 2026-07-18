const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Not required — allows a "platform" seller (e.g. existing legacy
      // products) that isn't tied to a real user account.
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    contactEmail: {
      type: String,
      trim: true,
    },

    contactPhone: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    // Percentage the platform keeps from every sale (e.g. 10 = 10%)
    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // True for the internal "RicX Official" seller used to migrate
    // pre-marketplace products. Cannot be edited/removed via the API.
    isPlatform: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seller", sellerSchema);
