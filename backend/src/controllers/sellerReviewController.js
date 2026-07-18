const Seller = require("../model/sellerModel");
const SellerReview = require("../model/sellerReviewModel");

// =========================
// Get a seller's public profile (business info + rating)
// =========================
const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({
      _id: req.params.id,
      status: "approved",
    }).select("businessName description rating numReviews createdAt");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get reviews for a seller
// =========================
const getSellerReviews = async (req, res) => {
  try {
    const reviews = await SellerReview.find({ seller: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Add / update my review for a seller
// =========================
const addSellerReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const sellerId = req.params.id;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    const seller = await Seller.findOne({ _id: sellerId, status: "approved" });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    let review = await SellerReview.findOne({
      user: req.user._id,
      seller: sellerId,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment || "";
      await review.save();
    } else {
      review = await SellerReview.create({
        user: req.user._id,
        seller: sellerId,
        rating,
        comment: comment || "",
      });
    }

    // Recalculate the seller's aggregate rating
    const allReviews = await SellerReview.find({ seller: sellerId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    seller.rating = Math.round(avgRating * 10) / 10;
    seller.numReviews = allReviews.length;
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Review saved",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSellerProfile,
  getSellerReviews,
  addSellerReview,
};
