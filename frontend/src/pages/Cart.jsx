import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCart,
  updateCart,
  removeCartItem,
} from "../api/cartApi";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data.cart.items || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQty = async (item) => {
    await updateCart(item.product._id, item.quantity + 1);
    fetchCart();
  };

  const decreaseQty = async (item) => {
    if (item.quantity === 1) return;

    await updateCart(item.product._id, item.quantity - 1);
    fetchCart();
  };

  const removeItem = async (id) => {
    await removeCartItem(id);
    fetchCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <h1 className="text-center mt-10 text-xl text-gray-900 dark:text-white">
        Loading Cart...
      </h1>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Add some products to continue shopping.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>

        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex items-center gap-6 bg-white dark:bg-gray-900 shadow rounded-xl p-4 mb-4"
            >
              <img
                src={item.product.image.url}
                className="w-24 h-24 rounded-lg object-cover"
                alt={item.product.name}
              />

              <div className="flex-1">

                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  {item.product.name}
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  ₹{item.product.price}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() => decreaseQty(item)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>

                <span className="font-semibold">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>

              </div>

              <button
                onClick={() => removeItem(item.product._id)}
                className="text-red-600 font-semibold hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-10 bg-white dark:bg-gray-900 shadow rounded-xl p-6 flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Total
              </h2>

              <p className="text-3xl text-indigo-600 font-bold mt-2">
                ₹{total}
              </p>

            </div>

            <Link
              to="/checkout"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
            >
              Proceed to Checkout
            </Link>

          </div>
        </>
      )}
    </div>
  );
}