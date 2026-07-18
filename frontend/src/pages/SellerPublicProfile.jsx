import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Store } from "lucide-react";
import {
  getSellerProfile,
  getSellerReviews,
  addSellerReview,
} from "../api/sellerApi";
import { getProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

export default function SellerPublicProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [profileRes, reviewsRes, productsRes] = await Promise.all([
        getSellerProfile(id),
        getSellerReviews(id),
        getProducts(1, 12, { seller: id }),
      ]);
      setSeller(profileRes.data.seller);
      setReviews(reviewsRes.data.reviews || []);
      setProducts(productsRes.data.product || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!myRating) {
      alert("Please select a rating");
      return;
    }
    try {
      setSubmitting(true);
      await addSellerReview(id, { rating: myRating, comment: myComment });
      setMyRating(0);
      setMyComment("");
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Please login to review this seller");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-500">
        Loading...
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-500">
        Seller not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center">
            <Store className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {seller.businessName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Star className="text-yellow-400" size={16} fill="currentColor" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {seller.rating || "No ratings yet"}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({seller.numReviews || 0} reviews)
              </span>
            </div>
            {seller.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
                {seller.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
        {/* Products */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
            Products from this seller
          </h2>
          {products.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No products listed yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
            Ratings & Reviews
          </h2>

          <form
            onSubmit={handleReviewSubmit}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 mb-6"
          >
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Rate this seller
            </p>
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setMyRating(s)}
                  aria-label={`Rate ${s} stars`}
                >
                  <Star
                    size={24}
                    className={
                      s <= myRating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-700"
                    }
                    fill={s <= myRating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              placeholder="Share your experience with this seller (optional)"
              rows={2}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white rounded-lg px-4 py-2.5"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-3 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>

          {reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r._id}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow p-4"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {r.user?.name || "Anonymous"}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= r.rating ? "text-yellow-400" : "text-gray-300"
                          }
                          fill={s <= r.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
