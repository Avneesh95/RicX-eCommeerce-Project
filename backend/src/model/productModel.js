const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // Which seller this product belongs to. Not required at the schema
    // level so existing rows keep working until the migration script
    // assigns them to the default "RicX Official" seller.
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
  },

  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
