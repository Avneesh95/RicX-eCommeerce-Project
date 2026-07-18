const mongoose = require("mongoose");

const sellerReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per seller
sellerReviewSchema.index({ user: 1, seller: 1 }, { unique: true });

module.exports = mongoose.model("SellerReview", sellerReviewSchema);
