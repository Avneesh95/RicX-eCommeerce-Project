import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, SlidersHorizontal, X } from "lucide-react";
import { getProducts } from "../api/productApi";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating_desc", label: "Top Rated" },
  { value: "name_asc", label: "Name: A → Z" },
];

export default function ProductGrid() {
  const [searchParams] = useSearchParams();
  const gridRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [categories, setCategories] = useState(["All"]);

  // Filter state (applied)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  // Debounced search input (typed value, separate from applied `search`)
  const [searchInput, setSearchInput] = useState("");

  // If someone clicks a category link elsewhere (e.g. "Shop by Category"),
  // sync the URL's ?category= into the filter and scroll to the grid
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
      setShowFilters(true);
      setPage(1);
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fetch the category list once (from a broad, unfiltered sample)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getProducts(1, 100);
        const unique = [
          "All",
          ...new Set((data.product || []).map((p) => p.category)),
        ];
        setCategories(unique);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await getProducts(page, 8, {
        search,
        category,
        sort,
        maxPrice,
        minRating: minRating > 0 ? minRating : undefined,
      });

      setProducts(data.product || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort, maxPrice, minRating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const getPagination = () => {
    const pages = [];
    const delta = 1;

    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("All");
    setSort("newest");
    setMaxPrice(100000);
    setMinRating(0);
    setPage(1);
  };

  const activeFilterCount =
    (category !== "All" ? 1 : 0) +
    (maxPrice < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <section ref={gridRef} className="max-w-7xl mx-auto px-6 py-10">
      {/* Search + Sort + Filter toggle */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 w-full lg:w-96 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex gap-3 flex-wrap">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className="relative flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:border-indigo-500 transition"
          >
            <SlidersHorizontal size={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              {/* Category */}
              <div>
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="mt-2 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Maximum Price:{" "}
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    ₹{maxPrice}
                  </span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="100000"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full mt-4"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Minimum Rating
                </label>
                <div className="flex gap-2 mt-2">
                  {[0, 1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setMinRating(r);
                        setPage(1);
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                        minRating === r
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-500"
                      }`}
                    >
                      {r === 0 ? (
                        "Any"
                      ) : (
                        <>
                          {r}
                          <Star size={12} fill="currentColor" />
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="mt-3 flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-lg font-semibold text-gray-500 dark:text-gray-400">
          Loading Products...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.length > 0 ? (
              products.map((p) => <ProductCard key={p._id} product={p} />)
            ) : (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-xl py-20">
                No Products Found
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center mt-14 gap-5">
          <p className="text-gray-600 dark:text-gray-400">
            Showing page <strong>{page}</strong> of{" "}
            <strong>{totalPages}</strong> • {totalProducts} Products
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => changePage(page - 1)}
              className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-40"
            >
              Previous
            </button>

            {getPagination().map((item, index) =>
              item === "..." ? (
                <span
                  key={index}
                  className="w-11 h-11 flex items-center justify-center text-gray-400 font-bold"
                >
                  ...
                </span>
              ) : (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => changePage(item)}
                  className={`w-11 h-11 rounded-xl font-semibold transition-all duration-300 ${
                    page === item
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 dark:text-white hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {item}
                </motion.button>
              ),
            )}

            <button
              disabled={page === totalPages}
              onClick={() => changePage(page + 1)}
              className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
