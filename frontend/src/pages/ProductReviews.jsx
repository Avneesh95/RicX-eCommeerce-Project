import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Star,
  Trash2,
  MessageSquare,
  Loader2,
  User,
  Send,
} from "lucide-react";

import {
  addReview,
  getReviews,
  deleteReview,
} from "../api/reviewApi";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState("");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  //------------------------------------------
  // Fetch Reviews
  //------------------------------------------

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const { data } = await getReviews(productId);

      setReviews(data.reviews || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  //------------------------------------------
  // Rating Summary
  //------------------------------------------

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  //------------------------------------------
  // Rating Distribution
  //------------------------------------------

  const ratingStats = useMemo(() => {
    const stats = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      stats[review.rating]++;
    });

    return stats;
  }, [reviews]);

  //------------------------------------------
  // Add Review
  //------------------------------------------

  const submitReview = async () => {
    setError("");
    setMessage("");

    if (!rating) {
      return setError("Please select a rating.");
    }

    if (!comment.trim()) {
      return setError("Please write your review.");
    }

    try {
      setSubmitting(true);

      const { data } = await addReview(productId, {
        rating,
        comment,
      });

      setMessage(data.message);

      setRating(0);

      setHoverRating(0);

      setComment("");

      fetchReviews();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  //------------------------------------------
  // Delete Review
  //------------------------------------------

  const removeReview = async (reviewId) => {
    if (!window.confirm("Delete this review?"))
      return;

    try {
      await deleteReview(reviewId);

      fetchReviews();
    } catch (err) {
      console.log(err);
    }
  };

  //------------------------------------------
  // Star Component
  //------------------------------------------

  const Stars = ({ value, editable = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{
              scale: editable ? 1.25 : 1,
            }}
            whileTap={{
              scale: editable ? 0.9 : 1,
            }}
            type="button"
            onClick={() =>
              editable && setRating(star)
            }
            onMouseEnter={() =>
              editable && setHoverRating(star)
            }
            onMouseLeave={() =>
              editable && setHoverRating(0)
            }
            className="transition"
          >
            <Star
              size={24}
              className={`${
                (
                  editable
                    ? hoverRating || rating
                    : value
                ) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };
    //------------------------------------------
  // Relative Time
  //------------------------------------------

  const timeAgo = (date) => {
    const seconds = Math.floor(
      (new Date() - new Date(date)) / 1000
    );

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);

      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  //------------------------------------------
  // JSX Starts
  //------------------------------------------

  return (
    <section className="mt-20">

      {/* Heading */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">

          Customer Reviews

        </h2>

        <p className="mt-3 text-gray-500 dark:text-gray-400">

          Share your experience and help others choose wisely.

        </p>
      </motion.div>

      {/* Summary */}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}

        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-800"
        >

          <h3 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">

            Overall Rating

          </h3>

          <div className="flex items-center gap-4">

            <span className="text-6xl font-black text-indigo-600">

              {averageRating}

            </span>

            <Stars value={Number(averageRating)} />

          </div>

          <p className="text-gray-500 mt-3">

            Based on {reviews.length} reviews

          </p>

          {/* Rating Breakdown */}

          <div className="mt-8 space-y-4">

            {[5,4,3,2,1].map((star)=>{

              const count = ratingStats[star];

              const percentage = reviews.length
                ? (count / reviews.length) * 100
                : 0;

              return(

                <div
                  key={star}
                  className="flex items-center gap-3"
                >

                  <span className="w-5 font-semibold">

                    {star}

                  </span>

                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">

                    <motion.div
                      initial={{ width:0 }}
                      whileInView={{ width:`${percentage}%` }}
                      transition={{ duration:1 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    />

                  </div>

                  <span className="text-sm font-semibold text-gray-500 w-10">

                    {count}

                  </span>

                </div>

              );

            })}

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          initial={{ opacity:0, x:25 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8"
        >

          <div className="flex items-center gap-3 mb-8">

            <MessageSquare
              className="text-indigo-600"
              size={30}
            />

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">

              Write a Review

            </h3>

          </div>

          {/* Stars */}

          <div className="mb-6">

            <Stars
              value={rating}
              editable
            />

          </div>

          {/* Textarea */}

          <textarea
            rows="5"
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
            placeholder="Tell others what you liked (or disliked)..."
            className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

          {/* Messages */}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className="mt-5 rounded-xl bg-red-100 text-red-700 px-5 py-3"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                className="mt-5 rounded-xl bg-green-100 text-green-700 px-5 py-3"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}

          <motion.button
            whileHover={{scale:1.03}}
            whileTap={{scale:0.95}}
            disabled={submitting}
            onClick={submitReview}
            className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl px-8 py-4 font-bold flex items-center gap-3"
          >
            {submitting ? (
              <Loader2
                className="animate-spin"
                size={20}
              />
            ) : (
              <Send size={20} />
            )}
            {submitting ? "Submitting..." : "Submit Review"}
          </motion.button>

        </motion.div>

      </div>
      
      {/* ===========================
          Reviews List
      ============================ */}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Customer Feedback
            </h2>
            <p className="text-gray-500 mt-2">
              {reviews.length} Review{reviews.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2
              className="animate-spin text-indigo-600"
              size={45}
            />
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl p-16 text-center"
          >
            <MessageSquare
              size={60}
              className="mx-auto text-indigo-500"
            />
            <h3 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
              No Reviews Yet
            </h3>
            <p className="mt-4 text-gray-500">
              Be the first customer to review this product.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatePresence>
              {reviews.map((review, index) => {
                const ownReview =
                  user &&
                  (review.user?._id === user._id ||
                    review.user === user._id);

                return (
                  <motion.div
                    key={review._id}
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -8,
                    }}
                    className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl border border-gray-200 dark:border-gray-800 transition-all duration-500"
                  >
                    {/* Gradient Header */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />

                    <div className="p-8">
                      {/* Top */}
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {review.user?.avatar ? (
                              <img
                                src={review.user.avatar}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              review.user?.name?.charAt(0)?.toUpperCase() || (
                                <User size={26} />
                              )
                            )}
                          </div>

                          {/* Name */}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {review.user?.name || "Anonymous"}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {timeAgo(review.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Delete */}
                        {ownReview && (
                          <motion.button
                            whileHover={{
                              rotate: -8,
                              scale: 1.15,
                            }}
                            whileTap={{
                              scale: 0.9,
                            }}
                            onClick={() =>
                              removeReview(review._id)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </motion.button>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="mt-6 flex gap-1">
                        {[1,2,3,4,5].map((star)=>(
                          <Star
                            key={star}
                            size={22}
                            className={`${
                              review.rating >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review */}
                      <p className="mt-6 text-gray-700 dark:text-gray-300 leading-8">
                        {review.comment}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </section>
  );
}