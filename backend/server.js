const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet"); // 🔒 Added for HTTP headers protection

dotenv.config();

const app = express();

// =========================
// SECURITY HEADERS
// =========================
app.use(helmet());

// =========================
// DATABASE
// =========================
const connectDB = require("./src/config/db.js");
connectDB();

// =========================
// MIDDLEWARE (ORDER MATTERS)
// =========================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://ricx.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Increased limits to accommodate uploads (e.g., invoices, profile pictures) safely
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =========================
// HEALTH CHECKS & ROOT
// =========================
app.get("/health", (req, res) => res.status(200).send("OK"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RicX API running successfully 🚀",
  });
});

// =========================
// ROUTES
// =========================
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/order", require("./src/routes/orderRoutes"));
app.use("/api/payment", require("./src/routes/paymentRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/invoice", require("./src/routes/invoiceRoutes"));
app.use("/api/wishlist", require("./src/routes/wishlistRoutes"));
app.use("/api/reviews", require("./src/routes/reviewRoutes"));
app.use("/api/coupon", require("./src/routes/couponRoutes"));
app.use("/api/offer", require("./src/routes/offerRoutes"));
app.use("/api/seller", require("./src/routes/sellerRoutes"));
app.use("/api/super-admin", require("./src/routes/superAdminRoutes"));

// =========================
// GLOBAL ERROR HANDLER (SAFE)
// =========================
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// =========================
// UNHANDLED EXCEPTION HANDLERS
// =========================
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down gracefully...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down gracefully...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});