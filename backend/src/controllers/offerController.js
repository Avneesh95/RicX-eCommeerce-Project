const cloudinary = require("../config/cloudinary");
const Offer = require("../model/offerModel");

// =========================
// Get the currently active Hero banner (public)
// =========================
const getActiveHeroOffer = async (req, res) => {
  try {
    const now = new Date();

    const offer = await Offer.findOne({
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: null },
        { startDate: { $lte: now } },
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get all offers (super admin)
// =========================
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Create offer / hero banner (super admin)
// =========================
const createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      discount,
      offerType,
      startDate,
      endDate,
      isActive,
      redirectUrl,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    let banner = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "RicX Offers",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      banner = result.secure_url;
    }

    // Only one hero banner should be active at a time
    if (isActive === "true" || isActive === true) {
      await Offer.updateMany({}, { isActive: false });
    }

    const offer = await Offer.create({
      title,
      description,
      banner,
      discount: discount || 0,
      offerType: offerType || "festival",
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isActive: isActive === "true" || isActive === true,
      redirectUrl,
    });

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update offer / hero banner (super admin)
// =========================
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    const {
      title,
      description,
      discount,
      offerType,
      startDate,
      endDate,
      isActive,
      redirectUrl,
    } = req.body;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "RicX Offers",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      offer.banner = result.secure_url;
    }

    const activating = isActive === "true" || isActive === true;

    if (activating) {
      await Offer.updateMany(
        { _id: { $ne: offer._id } },
        { isActive: false }
      );
    }

    if (title !== undefined) offer.title = title;
    if (description !== undefined) offer.description = description;
    if (discount !== undefined) offer.discount = discount;
    if (offerType !== undefined) offer.offerType = offerType;
    if (startDate !== undefined) offer.startDate = startDate || undefined;
    if (endDate !== undefined) offer.endDate = endDate || undefined;
    if (isActive !== undefined) offer.isActive = activating;
    if (redirectUrl !== undefined) offer.redirectUrl = redirectUrl;

    await offer.save();

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete offer (super admin)
// =========================
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getActiveHeroOffer,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
