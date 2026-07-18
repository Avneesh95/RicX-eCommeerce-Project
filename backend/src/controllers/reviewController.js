const Review = require("../model/reviewModel");
const Product = require("../model/productModel");

// ===============================
// Add Review
// ===============================
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // One review per user
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product.",
      });
    }

    // Create review
    await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    // Update rating
    const reviews = await Review.find({ product: productId });

    product.numReviews = reviews.length;

    product.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// Get Reviews
// ===============================
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// Delete Review
// ===============================
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    const product = await Product.findById(productId);

    const reviews = await Review.find({
      product: productId,
    });

    product.numReviews = reviews.length;

    product.rating =
      reviews.length === 0
        ? 0
        : reviews.reduce((acc, item) => acc + item.rating, 0) /
          reviews.length;

    await product.save();

    res.json({
      success: true,
      message: "Review deleted",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addReview,
  getReviews,
  deleteReview,
};