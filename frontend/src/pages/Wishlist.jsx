import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import {
  getWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

import { addToCart } from "../api/cartApi";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await getWishlist();
      setWishlist(res.data.wishlist.products || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =========================
  // Remove Product
  // =========================

  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
      alert("Removed from wishlist");
    } catch (error) {
      console.log(error);
      alert("Unable to remove");
    }
  };

  // =========================
  // Move To Cart
  // =========================

  const handleMoveToCart = async (id) => {
    try {
      await addToCart(id, 1);
      await removeFromWishlist(id);
      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
      alert("Moved to cart");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to move item"
      );
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-xl font-semibold">
        Loading Wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10 flex items-center gap-3 text-gray-900 dark:text-white">
          <Heart
            className="text-red-500"
            fill="currentColor"
          />
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg py-20 text-center">
            <Heart
              size={80}
              className="mx-auto text-red-400"
              fill="currentColor"
            />
            <h2 className="text-3xl font-bold mt-6 text-gray-900 dark:text-white">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">
              Save products you love and purchase them later.
            </p>
            <Link
              to="/"
              className="inline-block mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={product.image?.url}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      ₹{product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {product.category}
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={() => handleMoveToCart(product._id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>

                    <Link
                      to={`/product/${product._id}`}
                      className="w-full text-center border dark:border-gray-800 border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-3 rounded-xl font-semibold transition"
                    >
                      View Product
                    </Link>

                    <button
                      onClick={() => handleRemove(product._id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;