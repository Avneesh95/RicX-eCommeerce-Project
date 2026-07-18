import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import api from "../../api/axios";
import { deleteProduct } from "../../api/productApi";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products/mine");
      setProducts(data.product || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      fetchMyProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Products
        </h1>
        <Link
          to="/seller/add-product"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          <PlusCircle size={18} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't listed any products yet.
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-800 text-left text-gray-500 dark:text-gray-400">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b dark:border-gray-800">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p.image?.url}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {p.name}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{p.category}</td>
                  <td className="p-4 text-gray-900 dark:text-white">₹{p.price}</td>
                  <td className="p-4">
                    <span
                      className={
                        p.stock <= 5
                          ? "text-red-500 font-semibold"
                          : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Link
                      to={`/seller/add-product?edit=${p._id}`}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
