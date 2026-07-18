/**
 * One-time migration: assigns every existing product that has no `seller`
 * to a default "RicX Official" platform seller.
 *
 * Run manually, once, after deploying the marketplace feature:
 *
 *   cd backend
 *   node scripts/migrateDefaultSeller.js
 *
 * Safe to re-run — it only touches products where `seller` is missing.
 */

require("dotenv").config();
const mongoose = require("mongoose");

const Seller = require("../src/model/sellerModel");
const Product = require("../src/model/productModel");

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set — check your .env file");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let platformSeller = await Seller.findOne({ isPlatform: true });

  if (!platformSeller) {
    platformSeller = await Seller.create({
      businessName: "RicX Official",
      description: "Products sold directly by RicX.",
      status: "approved",
      commissionRate: 0,
      isPlatform: true,
    });
    console.log("Created platform seller:", platformSeller._id.toString());
  } else {
    console.log("Using existing platform seller:", platformSeller._id.toString());
  }

  const result = await Product.updateMany(
    { seller: { $exists: false } },
    { $set: { seller: platformSeller._id } }
  );

  // Also catch products where seller is explicitly null
  const result2 = await Product.updateMany(
    { seller: null },
    { $set: { seller: platformSeller._id } }
  );

  const updated =
    (result.modifiedCount || 0) + (result2.modifiedCount || 0);

  console.log(`Migrated ${updated} product(s) to the platform seller.`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
