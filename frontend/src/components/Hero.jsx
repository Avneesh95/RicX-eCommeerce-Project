import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getHeroCoupon } from "../api/couponApi";
import { getActiveHeroOffer } from "../api/offerApi";

const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900";

// 1. Move static items out of the render loop to prevent re-render glitches
const STATIC_DOTS = Array.from({ length: 25 }, () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 3}s`,
}));

const stats = [
  { number: "15K+", title: "Products" },
  { number: "100K+", title: "Customers" },
  { number: "4.9★", title: "Reviews" },
];

// 2. Framer Motion Variants for cleaner JSX layout orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemFadeLeft = {
  hidden: { opacity: 0, x: -50, y: 15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const HeroSection = () => {
  const [heroCoupon, setHeroCoupon] = useState(null);
  const [copied, setCopied] = useState(false);
  const [heroOffer, setHeroOffer] = useState(null);

  useEffect(() => {
    const loadCoupon = async () => {
      try {
        const res = await getHeroCoupon();
        setHeroCoupon(res.data.coupon);
      } catch (err) {
        console.error("Failed to load hero coupon:", err);
      }
    };

    const loadOffer = async () => {
      try {
        const res = await getActiveHeroOffer();
        setHeroOffer(res.data.offer);
      } catch (err) {
        console.error("Failed to load hero banner:", err);
      }
    };

    loadCoupon();
    loadOffer();
  }, []);

  const handleCopy = () => {
    if (!heroCoupon?.code) return;
    navigator.clipboard.writeText(heroCoupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset button text after 2 seconds
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white dark:from-black dark:via-gray-950 dark:to-slate-950">
      
      {/* Aurora Background Graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-[130px] animate-pulse" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-pink-500/20 blur-[150px] animate-pulse" />
        <div className="absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      {/* Background Micro-stars */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {STATIC_DOTS.map((dot, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white animate-pulse"
            style={{
              top: dot.top,
              left: dot.left,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          
          {/* LEFT SIDE CONTENT */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Dynamic Coupon Card Box (Features 2, 3, & 5) */}
            <motion.div
              variants={itemFadeLeft}
              className="flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl w-full max-w-md"
            >
              <div className="flex flex-wrap items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span className="animate-pulse text-2xl">🔥</span>
                  <span className="font-bold tracking-wide text-yellow-300">
                    {heroCoupon ? (
                      <>{heroCoupon.code} • {heroCoupon.discountType === "percentage" ? `${heroCoupon.discountValue}% OFF` : `₹${heroCoupon.discountValue} OFF`}</>
                    ) : (
                      <>Biggest Sale • Up to 70% OFF</>
                    )}
                  </span>
                </div>

                {heroCoupon?.code && (
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                      copied 
                        ? "bg-green-600 text-white" 
                        : "bg-white text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {copied ? "Copied! ✓" : "Copy Code"}
                  </button>
                )}
              </div>

              {heroCoupon && (
                <div className="border-t border-white/10 pt-2 mt-1 w-full space-y-1">
                  {heroCoupon.description && (
                    <p className="text-sm font-medium text-gray-200">
                      "{heroCoupon.description}"
                    </p>
                  )}
                  {heroCoupon.expiryDate && (
                    <p className="text-xs text-gray-400 font-medium">
                      Valid till {formatDate(heroCoupon.expiryDate)}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Core Heading */}
            <motion.h1
              variants={itemFadeLeft}
              className="mt-8 text-5xl font-black leading-tight md:text-7xl"
            >
              Upgrade Your <br />
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                Shopping Experience
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemFadeLeft}
              className="mt-8 max-w-xl text-lg leading-8 text-gray-300"
            >
              Experience premium shopping with exclusive deals, lightning-fast
              delivery, secure payments, and carefully selected products—all in one place.
            </motion.p>

            {/* CTA Option Group */}
            <motion.div variants={itemFadeLeft} className="mt-12 flex flex-wrap gap-5">
              <button
                onClick={scrollToProducts}
                className="group rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-8 py-4 font-bold shadow-2xl transition duration-300 hover:scale-105"
              >
                Shop Now
                <span className="ml-2 inline-block transition group-hover:translate-x-2">→</span>
              </button>

              <button className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 backdrop-blur-xl transition duration-300 hover:bg-white hover:text-black">
                Browse Collection
              </button>
            </motion.div>

            {/* Shipping Trust Highlights */}
            <motion.div variants={itemFadeLeft} className="mt-12 flex flex-wrap gap-8 select-none">
              <div className="flex items-center gap-2">🚚 <span className="text-gray-300">Free Shipping</span></div>
              <div className="flex items-center gap-2">🔒 <span className="text-gray-300">Secure Payment</span></div>
              <div className="flex items-center gap-2">↩️ <span className="text-gray-300">Easy Returns</span></div>
            </motion.div>

            {/* Metrics Dashboard */}
            <motion.div variants={itemFadeLeft} className="mt-14 grid grid-cols-3 gap-5 w-full">
              {stats.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl shadow-xl"
                >
                  <h2 className="text-3xl font-black text-white">{item.number}</h2>
                  <p className="mt-2 text-gray-300 text-sm">{item.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE GRAPHICS */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center mt-16 lg:mt-0"
          >
            {/* Glowing Backdrop Elements */}
            <div className="absolute h-[550px] w-[550px] rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-30 blur-[140px] animate-pulse" />
            <div className="absolute h-[470px] w-[470px] rounded-full border border-white/10 animate-spin [animation-duration:25s]" />
            <div className="absolute h-[560px] w-[560px] rounded-full border border-indigo-500/20 animate-spin direction-reverse [animation-duration:40s]" />

            {/* Main Showcase Art Frame */}
            <motion.img
              src={heroOffer?.banner || DEFAULT_POSTER}
              alt={heroOffer?.title || "Premium shopping selection showcase"}
              whileHover={{ scale: 1.05, rotate: -2 }}
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 w-full max-w-lg rounded-3xl border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.45)] object-cover aspect-square"
              onClick={() => {
                if (heroOffer?.redirectUrl) {
                  window.location.href = heroOffer.redirectUrl;
                }
              }}
              style={heroOffer?.redirectUrl ? { cursor: "pointer" } : undefined}
            />

            {/* Floating Dynamic Discount Bubble */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute left-0 top-8 z-30 rounded-3xl bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:left-4 lg:left-0"
            >
              <h3 className="text-4xl font-black text-red-500">
                {heroCoupon ? (
                  heroCoupon.discountType === "percentage" ? `${heroCoupon.discountValue}%` : `₹${heroCoupon.discountValue}`
                ) : (
                  "70%"
                )}
              </h3>
              <p className="font-semibold text-gray-800">{heroCoupon?.code || "Mega Discount"}</p>
              <span className="text-sm text-gray-500">Limited Time Offer</span>
            </motion.div>

            {/* Trust Evaluation Tag */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-8 right-0 z-30 rounded-3xl bg-white/95 p-5 shadow-2xl backdrop-blur-xl md:right-4 lg:right-0"
            >
              <div className="text-xl text-yellow-500">⭐⭐⭐⭐⭐</div>
              <p className="font-bold text-gray-800">4.9 / 5 Rating</p>
              <span className="text-sm text-gray-500 font-medium">Trusted by 100K+ Customers</span>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;