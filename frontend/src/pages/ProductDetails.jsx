import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import { getProductById, getRelatedProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data.product);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch "You may also like" once we know the product's category
  useEffect(() => {
    if (!product?._id) return;

    (async () => {
      try {
        const { data } = await getRelatedProducts(product._id, 6);
        setRelatedProducts(data.products || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [product?._id]);

  const handleAddToCart = async () => {
    try {
      setLoading(true);

      await addToCart(product._id, quantity);

      alert("Product added to cart");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Please login first"
      );
    } finally {
      setLoading(false);
    }
  };

  // BUY NOW (No cart)
  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        buyNow: true,
        product,
        quantity,
      },
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-3xl font-bold">
        Loading...
      </div>
    );
  };
    return (
    <div className="bg-gray-100 min-h-screen py-10">

      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="grid lg:grid-cols-2 gap-10 p-10">

          {/* Product Image */}
          <div className="flex justify-center items-center">

            <img
              src={product.image?.url}
              alt={product.name}
              className="w-full max-w-lg rounded-2xl object-cover shadow-lg"
            />

          </div>

          {/* Product Details */}
          <div>

            <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold">
              {product.category}
            </span>

            <h1 className="text-5xl font-bold mt-5 text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {product.seller?.businessName && (
              <Link
                to={
                  product.seller.isPlatform
                    ? "#"
                    : `/store/${product.seller._id}`
                }
                onClick={(e) => product.seller.isPlatform && e.preventDefault()}
                className="inline-block mt-2 text-sm text-gray-500 hover:text-indigo-600"
              >
                Sold by{" "}
                <span className="font-semibold">
                  {product.seller.businessName}
                </span>
                {product.seller.rating > 0 && (
                  <span className="ml-2 text-yellow-500">
                    ★ {product.seller.rating}
                  </span>
                )}
              </Link>
            )}

            <div className="flex items-center gap-3 mt-4">

              <span className="text-yellow-500 text-2xl">
                ⭐⭐⭐⭐⭐
              </span>

              <span className="text-gray-500">
                (4.8 Ratings)
              </span>

            </div>

            <h2 className="text-5xl font-bold text-green-600 mt-8">
              ₹{product.price}
            </h2>

            <p className="mt-8 text-gray-600 leading-8 text-lg">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-8">

              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                Availability
              </h3>

              <span
                className={`inline-block mt-2 px-4 py-2 rounded-full text-white font-semibold ${
                  product.stock > 0
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} In Stock`
                  : "Out of Stock"}
              </span>

            </div>

            {/* Quantity */}
            <div className="mt-10">

              <h3 className="font-bold mb-3 text-gray-900 dark:text-white">
                Quantity
              </h3>

              <div className="flex items-center gap-4">

                <button
                  onClick={() =>
                    quantity > 1 &&
                    setQuantity(quantity - 1)
                  }
                  className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                >
                  -
                </button>

                <span className="text-2xl font-bold">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    quantity < product.stock &&
                    setQuantity(quantity + 1)
                  }
                  className="w-12 h-12 rounded-lg bg-gray-200 hover:bg-gray-300 text-xl font-bold"
                >
                  +
                </button>

              </div>

            </div>

            {/* Buttons */}
            <div className="grid md:grid-cols-2 gap-5 mt-10">

              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-bold transition disabled:bg-gray-400"
              >
                {loading
                  ? "Adding..."
                  : "🛒 Add To Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-bold transition disabled:bg-gray-400"
              >
                ⚡ Buy Now
              </button>

            </div>

            {/* Features */}
            <div className="mt-12 border-t pt-8 space-y-4 text-gray-600">

              <p>🚚 Free Delivery Across India</p>

              <p>🔄 7 Days Easy Replacement</p>

              <p>🛡️ 100% Genuine Products</p>

              <p>💳 Secure Razorpay Payment</p>

            </div>

          </div>

        </div>

      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-14 px-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}