import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Boxes,
  AlertTriangle,
  XCircle,
  IndianRupee,
} from "lucide-react";

import { getProducts, deleteProduct } from "../../api/productApi";

const Products = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);


  const lowStock = products.filter(
  (p) => p.stock > 0 && p.stock <= 5
).length;

const outOfStock = products.filter(
  (p) => p.stock === 0
).length;

const inventoryValue = products.reduce(
  (sum, p) => sum + p.price * p.stock,
  0
);


  // ===========================
  // Fetch Products
  // ===========================
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await getProducts({
        page,
        search,
        category,
        sort,
      });

      setProducts(res.data.product || []);

      setTotalPages(res.data.totalPages || 1);

      setTotalProducts(res.data.totalProducts || 0);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, sort]);

  // ===========================
  // Delete Product
  // ===========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product permanently?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      fetchProducts();

      alert("Product deleted successfully");
    } catch (err) {
      console.error(err);

      alert("Delete failed");
    }
  };

  // ===========================
  // Stock Badge
  // ===========================
  const getStockBadge = (stock) => {
    if (stock === 0)
      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold">
          Out of Stock
        </span>
      );

    if (stock <= 5)
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
          Low Stock ({stock})
        </span>
      );

    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
        In Stock ({stock})
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-xl font-semibold text-gray-500 dark:text-gray-400">
          Loading Products...
        </div>
      </div>
    );
  }

  return (<div className="p-6 space-y-8">

  {/* Header */}

  <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

    <div>

      <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
        Manage Products
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Total Products : <span className="font-semibold">{totalProducts}</span>
      </p>

    </div>

    <Link
      to="/admin/add-product"
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 w-fit shadow-lg transition"
    >
      <Plus size={20} />
      Add Product
    </Link>

  </div>

  {/* Filters */}

 {/* =========================== */}
{/* Filters */}
{/* =========================== */}

<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border dark:border-gray-800 border-gray-100 p-6">

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

    {/* Search */}

    <div className="relative">

      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full border dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

    </div>

    {/* Category */}

    <select
      value={category}
      onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
      }}
      className="border dark:border-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
    >
      <option value="All">All Categories</option>
      <option value="Mobile">Mobile</option>
      <option value="Laptop">Laptop</option>
      <option value="Headphones">Headphones</option>
      <option value="Accessories">Accessories</option>
    </select>

    {/* Sort */}

    <select
      value={sort}
      onChange={(e) => {
        setSort(e.target.value);
        setPage(1);
      }}
      className="border dark:border-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="price_asc">Price Low → High</option>
      <option value="price_desc">Price High → Low</option>
      <option value="name_asc">Name A → Z</option>
      <option value="name_desc">Name Z → A</option>
    </select>

  </div>

</div>
  {/* Products Table */}

  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

    <table className="w-full">

      <thead className="bg-slate-100">

        <tr>

          <th className="text-left px-6 py-4">Product</th>

          <th className="text-left px-6 py-4">Category</th>

          <th className="text-left px-6 py-4">Price</th>

          <th className="text-left px-6 py-4">Stock</th>

          <th className="text-center px-6 py-4">Actions</th>

        </tr>

      </thead>

      <tbody>

        {products.length === 0 ? (

          <tr>

            <td
              colSpan={5}
              className="text-center py-16 text-gray-400"
            >

              <div className="flex flex-col items-center gap-3">

                <Package size={55} />

                <p className="text-lg">
                  No Products Found
                </p>

              </div>

            </td>

          </tr>

        ) : (

          products.map((product) => (

            <tr
              key={product._id}
              className="border-t hover:bg-slate-50 transition"
            >

              <td className="px-6 py-5">

                <div className="flex items-center gap-4">

                  <img
                    src={product.image?.url}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover shadow"
                  />

                  <div>

                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {product.description}
                    </p>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5">
                {product.category}
              </td>

              <td className="px-6 py-5 font-bold text-green-600">
                ₹{product.price}
              </td>

              <td className="px-6 py-5">
                {getStockBadge(product.stock)}
              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <Link
                    to={`/admin/edit-product/${product._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>
        {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5 bg-slate-50 border-t">

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Showing page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">

            {/* Previous */}

            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-900 border dark:border-gray-800 hover:bg-gray-100 dark:bg-gray-950"
              }`}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            {/* Page Numbers */}

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  page === index + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-gray-900 border dark:border-gray-800 hover:bg-gray-100 dark:bg-gray-950"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next */}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-900 border dark:border-gray-800 hover:bg-gray-100 dark:bg-gray-950"
              }`}
            >
              Next
              <ChevronRight size={18} />
            </button>

          </div>

        </div>
      )}

      {/* Footer */}

      <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">

        <h2 className="text-2xl font-bold text-white">
          Product Management
        </h2>

        <p className="mt-2 text-blue-100">
          Search, filter, sort, edit and manage your entire inventory from one
          place. Quickly identify low-stock products and keep your catalog
          organized.
        </p>

      </div>

    </div>
  );
};

export default Products;