import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { addToCart } from "../api/cartApi";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../api/wishlistApi";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return null;

  // ==========================
  // Load Wishlist Status
  // ==========================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();

        const exists =
          res.data.wishlist?.products?.some(
            (item) => item.product && item.product._id === product._id,
          ) || false;
        setWishlisted(exists);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, [product._id]);

  // ==========================
  // Wishlist Toggle
  // ==========================
  const handleWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setWishlistLoading(true);

      if (wishlisted) {
        await removeFromWishlist(product._id);
        setWishlisted(false);
      } else {
        await addToWishlist(product._id);
        setWishlisted(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Wishlist Error");
    } finally {
      setWishlistLoading(false);
    }
  };

  // ==========================
  // Add To Cart
  // ==========================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      await addToCart(product._id, 1);

      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add cart");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Buy Now
  // ==========================
  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      await addToCart(product._id, 1);

      navigate("/checkout");
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={product.image?.url}
          alt={product.name}
          className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:scale-110 transition"
        >
          <Heart
            size={22}
            className={`transition ${
              wishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-500 hover:text-red-500"
            }`}
          />
        </button>

        {/* Stock Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full ${
            product.stock > 0
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition">
          {product.name}
        </h2>

        {product.seller?.businessName && (
          <Link
            to={product.seller.isPlatform ? "#" : `/store/${product.seller._id}`}
            onClick={(e) => product.seller.isPlatform && e.preventDefault()}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 mt-1 inline-block"
          >
            Sold by <span className="font-medium">{product.seller.businessName}</span>
          </Link>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{product.price}
          </span>

          <span className="text-xs text-gray-500">{product.category}</span>
        </div>
        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={loading || product.stock === 0}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>

        {/* View Details */}
        <Link
          to={`/product/${product._id}`}
          className="block mt-4 text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
