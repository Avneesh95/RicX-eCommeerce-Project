const cloudinary = require("../config/cloudinary");
const Product = require("../model/productModel");
const Seller = require("../model/sellerModel");

const XLSX = require("xlsx");

// =========================
// Create Product
// =========================
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image",
      });
    }

    // If a seller is creating this product, attach their seller profile
    let sellerId;
    if (req.user?.role === "seller") {
      const sellerProfile = await Seller.findOne({
        user: req.user._id,
        status: "approved",
      });

      if (!sellerProfile) {
        return res.status(403).json({
          success: false,
          message: "Your seller account is not approved",
        });
      }

      sellerId = sellerProfile._id;
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "RicX Products",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      seller: sellerId,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =========================
// Get All Products
// =========================
const products = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 8, 1);

    const search = req.query.search?.trim() || "";
    const category = req.query.category || "";
    const sort = req.query.sort || "newest";

    const query = {};

    // Search by name OR category
    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Category Filter
    if (category && category !== "All") {
      query.category = category;
    }

    // Price Range Filter
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null && !Number.isNaN(minPrice)) query.price.$gte = minPrice;
      if (maxPrice !== null && !Number.isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Minimum Rating Filter
    const minRating = req.query.minRating ? Number(req.query.minRating) : null;
    if (minRating !== null && !Number.isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }

    // Seller Filter (for seller storefront pages)
    if (req.query.seller) {
      query.seller = req.query.seller;
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "price_asc":
        sortOption = { price: 1 };
        break;

      case "price_desc":
        sortOption = { price: -1 };
        break;

      case "name_asc":
        sortOption = { name: 1 };
        break;

      case "name_desc":
        sortOption = { name: -1 };
        break;

      case "rating_desc":
        sortOption = { rating: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);

    const product = await Product.find(query)
      .populate("seller", "businessName rating isPlatform")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      product,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// Get Product By ID
// =========================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate(
      "seller",
      "businessName rating numReviews isPlatform"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Related Products ("You may also like")
// =========================
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prefer same-category products, excluding the current one
    let related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);

    // Backfill with other products if the category doesn't have enough
    if (related.length < limit) {
      const excludeIds = [product._id, ...related.map((p) => p._id)];

      const fallback = await Product.find({
        _id: { $nin: excludeIds },
      })
        .sort({ rating: -1, createdAt: -1 })
        .limit(limit - related.length);

      related = [...related, ...fallback];
    }

    res.status(200).json({
      success: true,
      products: related,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Product
// =========================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Sellers may only edit their own products
    if (req.user?.role === "seller") {
      const sellerProfile = await Seller.findOne({ user: req.user._id });
      if (
        !sellerProfile ||
        !product.seller ||
        product.seller.toString() !== sellerProfile._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only edit your own products",
        });
      }
    }

    // Update image if new image uploaded
    if (req.file) {
      // Delete old image
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "RicX Products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      product.image = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Product
// =========================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Sellers may only delete their own products
    if (req.user?.role === "seller") {
      const sellerProfile = await Seller.findOne({ user: req.user._id });
      if (
        !sellerProfile ||
        !product.seller ||
        product.seller.toString() !== sellerProfile._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own products",
        });
      }
    }

    // Delete image from Cloudinary
    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }



  
};

//
// =========================
// Bulk Upload Products
// =========================
const bulkUploadProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    // Sellers: attach their own seller id. Admin/superAdmin: attach the
    // platform seller so bulk-uploaded catalog products aren't orphaned.
    let sellerId = null;

    if (req.user?.role === "seller") {
      const sellerProfile = await Seller.findOne({
        user: req.user._id,
        status: "approved",
      });

      if (!sellerProfile) {
        return res.status(403).json({
          success: false,
          message: "Your seller account is not approved",
        });
      }

      sellerId = sellerProfile._id;
    } else {
      const platformSeller = await Seller.findOne({ isPlatform: true });
      sellerId = platformSeller?._id || null;
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });

    const sheet = workbook.Sheets[
      workbook.SheetNames[0]
    ];

    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "Excel file is empty",
      });
    }

    let success = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        const exists = await Product.findOne({
          name: row.name,
          seller: sellerId,
        });

        if (exists) {
          failed++;
          continue;
        }

        await Product.create({
          name: row.name,
          description: row.description,
          price: Number(row.price),
          category: row.category,
          stock: Number(row.stock),
          seller: sellerId,

          image: {
            public_id: "",
            url: row.image || "",
          },
        });

        success++;

      } catch (err) {
        failed++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Bulk upload completed",
      uploaded: success,
      skipped: failed,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// Get My Products (seller dashboard)
// =========================
const getMyProducts = async (req, res) => {
  try {
    const sellerProfile = await Seller.findOne({ user: req.user._id });

    if (!sellerProfile) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const totalProducts = await Product.countDocuments({
      seller: sellerProfile._id,
    });

    const product = await Product.find({ seller: sellerProfile._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      product,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Download Sample Excel Template (generated on the fly)
// =========================
const downloadSampleTemplate = async (req, res) => {
  try {
    const sampleRows = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "Over-ear headphones with active noise cancellation",
        price: 2499,
        category: "Electronics",
        stock: 50,
        image: "https://example.com/images/headphones.jpg",
      },
      {
        name: "Men's Running Shoes",
        description: "Lightweight breathable running shoes",
        price: 1899,
        category: "Shoes",
        stock: 30,
        image: "https://example.com/images/shoes.jpg",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sample-products.xlsx"
    );

    res.send(buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  bulkUploadProducts,
  downloadSampleTemplate,
  products,
  getProductById,
  getRelatedProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
};