const Coupon = require("../model/coupon");

/* =====================================================
   CREATE COUPON
===================================================== */

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
    } = req.body;

    if (
      !code ||
      !discountType ||
      !discountValue ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const couponCode = code.trim().toUpperCase();

    const exists = await Coupon.findOne({
      code: couponCode,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists.",
      });
    }

    const coupon = await Coupon.create({
      code: couponCode,
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount: maxDiscount || 0,
      expiryDate,
      usageLimit: usageLimit || 1000,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* =====================================================
   GET ACTIVE HERO COUPON
===================================================== */

exports.getHeroCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      showOnHero: true,
      isActive: true,
    }).sort({
      updatedAt: -1,
    });

    if (!coupon) {
      return res.json({
        success: true,
        coupon: null,
      });
    }

    res.json({
      success: true,
      coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   SET HERO COUPON
===================================================== */

exports.setHeroCoupon = async (req, res) => {
  try {
    await Coupon.updateMany(
      {},
      {
        showOnHero: false,
      }
    );

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.showOnHero = true;

    await coupon.save();

    res.json({
      success: true,
      message: "Hero Coupon Updated",
      coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   GET ALL COUPONS
===================================================== */

exports.getCoupons = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const keyword = req.query.keyword || "";

    const query = {};

    if (keyword) {
      query.code = {
        $regex: keyword,
        $options: "i",
      };
    }

    const totalCoupons = await Coupon.countDocuments(query);

    const coupons = await Coupon.find(query)
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      success: true,
      coupons,
      page,
      totalCoupons,
      totalPages: Math.ceil(totalCoupons / limit),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   GET SINGLE COUPON
===================================================== */

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.json({
      success: true,
      coupon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   UPDATE COUPON
===================================================== */

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
    } = req.body;

    if (code) {
      const couponCode = code.trim().toUpperCase();

      const exists = await Coupon.findOne({
        code: couponCode,
        _id: { $ne: coupon._id },
      });

      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists.",
        });
      }

      coupon.code = couponCode;
    }

    if (description !== undefined)
      coupon.description = description;

    if (discountType)
      coupon.discountType = discountType;

    if (discountValue !== undefined)
      coupon.discountValue = discountValue;

    if (minOrderAmount !== undefined)
      coupon.minOrderAmount = minOrderAmount;

    if (maxDiscount !== undefined)
      coupon.maxDiscount = maxDiscount;

    if (expiryDate)
      coupon.expiryDate = expiryDate;

    if (usageLimit !== undefined)
      coupon.usageLimit = usageLimit;

    await coupon.save();

    return res.json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   DELETE COUPON
===================================================== */

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    await coupon.deleteOne();

    return res.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   ENABLE / DISABLE COUPON
===================================================== */

exports.toggleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    return res.json({
      success: true,
      message: coupon.isActive
        ? "Coupon Activated Successfully."
        : "Coupon Disabled Successfully.",
      coupon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   RESET COUPON USAGE
===================================================== */

exports.resetCouponUsage = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.usedCount = 0;

    await coupon.save();

    return res.json({
      success: true,
      message: "Coupon usage reset successfully.",
      coupon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   APPLY COUPON
===================================================== */

exports.applyCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and amount are required.",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is disabled.",
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired.",
      });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded.",
      });
    }

    if (Number(amount) < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount should be ₹${coupon.minOrderAmount}.`,
      });
    }

    let discount = 0;

    // Percentage Discount
    if (coupon.discountType === "percentage") {
      discount =
        (Number(amount) * coupon.discountValue) / 100;

      if (
        coupon.maxDiscount &&
        coupon.maxDiscount > 0 &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }
    }

    // Fixed Discount
    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    // Discount should never exceed order amount
    if (discount > Number(amount)) {
      discount = Number(amount);
    }

    const finalAmount = Number(amount) - discount;

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",

      coupon: {
        _id: coupon._id,
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
      },

      discount,

      finalAmount,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =====================================================
   MARK COUPON AS USED
   (Call this after successful payment)
===================================================== */

exports.markCouponUsed = async (couponCode) => {
  try {
    if (!couponCode) return;

    await Coupon.findOneAndUpdate(
      {
        code: couponCode.toUpperCase(),
      },
      {
        $inc: {
          usedCount: 1,
        },
      }
    );
  } catch (err) {
    console.log("Coupon Usage Error:", err.message);
  }
};

/* =====================================================
   VALIDATE COUPON
   (Reusable helper)
===================================================== */

exports.validateCoupon = async (code, amount) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (!coupon)
    return {
      success: false,
      message: "Invalid Coupon",
    };

  if (!coupon.isActive)
    return {
      success: false,
      message: "Coupon Disabled",
    };

  if (coupon.expiryDate < new Date())
    return {
      success: false,
      message: "Coupon Expired",
    };

  if (coupon.usedCount >= coupon.usageLimit)
    return {
      success: false,
      message: "Coupon Limit Reached",
    };

  if (amount < coupon.minOrderAmount)
    return {
      success: false,
      message: `Minimum order ₹${coupon.minOrderAmount}`,
    };

  return {
    success: true,
    coupon,
  };
};