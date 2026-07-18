const PDFDocument = require("pdfkit");
const Order = require("../model/orderModel");

const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=RicX-Invoice-${order._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Color Palette Definition
    const PRIMARY_COLOR = "#4F46E5"; // Indigo Accent
    const TEXT_DARK = "#1F2937";    // Near Black
    const TEXT_LIGHT = "#6B7280";   // Slate Gray
    const BG_LIGHT = "#F9FAFB";     // Cool White/Light Gray
    const BORDER_COLOR = "#E5E7EB"; // Sophisticated Frame Border

    // ==================================
    // ELEGANT FRAME BORDER
    // ==================================
    // Draw a premium double-line border framework around the whole page margins
    doc
      .strokeColor(PRIMARY_COLOR)
      .lineWidth(1)
      .rect(30, 30, 535, 782)
      .stroke();

    doc
      .strokeColor(BORDER_COLOR)
      .lineWidth(0.5)
      .rect(34, 34, 527, 774)
      .stroke();

    // ==================================
    // BRAND HEADER
    // ==================================
    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(24)
      .text("RicX Store", 55, 55, { bold: true })
      .fontSize(10)
      .fillColor(TEXT_LIGHT)
      .text("Premium Online Shopping", 55, 85);

    // Right-aligned header metadata (Stacked cleanly to completely prevent overlap)
    doc
      .fillColor(TEXT_DARK)
      .fontSize(20)
      .text("INVOICE", 400, 52, { align: "right" })
      .fontSize(9)
      .fillColor(TEXT_LIGHT)
      .text(`Invoice ID: ${order._id}`, 245, 77, { width: 295, align: "right" })
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 92, { align: "right" });

    // Decorative top divider line
    doc
      .strokeColor(BORDER_COLOR)
      .lineWidth(1)
      .moveTo(55, 115)
      .lineTo(540, 115)
      .stroke();

    // ==================================
    // BILLING & SHIPPING DETAILS (Two-Column Layout)
    // ==================================
    const detailsTop = 135;

    // Left Column: Customer Details
    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(12)
      .text("Customer Details", 55, detailsTop)
      .moveDown(0.4)
      .fillColor(TEXT_DARK)
      .fontSize(10)
      .text(`Name: ${order.user.name}`)
      .text(`Email: ${order.user.email}`)
      .text(`Phone: ${order.shippingAddress.phone || "N/A"}`);

    // Right Column: Shipping Address
    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(12)
      .text("Shipping Address", 300, detailsTop)
      .moveDown(0.4)
      .fillColor(TEXT_DARK)
      .fontSize(10)
      .text(`${order.shippingAddress.fullName}`)
      .text(`${order.shippingAddress.address}`)
      .text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`)
      .text(`${order.shippingAddress.country} - ${order.shippingAddress.pincode}`);

    // ==================================
    // ORDER METADATA BAR
    // ==================================
    const metaTop = 235;
    
    // Soft container box background
    doc
      .rect(55, metaTop, 485, 35)
      .fill(BG_LIGHT);

    doc
      .fillColor(TEXT_DARK)
      .fontSize(9)
      .text(`Payment Method: ${order.paymentMethod}`, 70, metaTop + 13)
      .text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 240, metaTop + 13)
      .text(`Order Status: ${order.status.toUpperCase()}`, 410, metaTop + 13);

    // ==================================
    // PRODUCTS TABLE
    // ==================================
    let tableTop = 295;

    // Table Header Row
    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(10)
      .text("Product Details", 55, tableTop)
      .text("Qty", 350, tableTop, { width: 40, align: "center" })
      .text("Price", 410, tableTop, { width: 60, align: "right" })
      .text("Total", 480, tableTop, { width: 60, align: "right" });

    // Underline beneath headers
    doc
      .strokeColor(PRIMARY_COLOR)
      .lineWidth(1)
      .moveTo(55, tableTop + 15)
      .lineTo(540, tableTop + 15)
      .stroke();

    tableTop += 25;
    doc.fillColor(TEXT_DARK);

    // Table Body Items Loop
    order.orderItems.forEach((item) => {
      const itemTotal = item.quantity * item.price;

      doc
        .fontSize(10)
        .text(item.product.name.substring(0, 42), 55, tableTop, { width: 280 })
        .text(item.quantity.toString(), 350, tableTop, { width: 40, align: "center" })
        .text(`Rs. ${item.price.toLocaleString("en-IN")}`, 410, tableTop, { width: 60, align: "right" })
        .text(`Rs. ${itemTotal.toLocaleString("en-IN")}`, 480, tableTop, { width: 60, align: "right" });

      // Light gridline between items
      doc
        .strokeColor("#F3F4F6")
        .lineWidth(0.5)
        .moveTo(55, tableTop + 20)
        .lineTo(540, tableTop + 20)
        .stroke();

      tableTop += 30;
    });

    // ==================================
    // SUMMARY / TOTALS SECTION
    // ==================================
    tableTop += 10;

    doc
      .fillColor(PRIMARY_COLOR)
      .fontSize(13)
      .text("Grand Total:", 350, tableTop, { width: 100, align: "right" })
      .fillColor("#059669") 
      .text(`Rs. ${order.totalAmount.toLocaleString("en-IN")}`, 455, tableTop, { width: 85, align: "right" });

    // ==================================
    // FOOTER & PREMIUM THANK YOU NOTE
    // ==================================
    const footerTop = 715;

    doc
      .strokeColor(BORDER_COLOR)
      .lineWidth(1)
      .moveTo(55, footerTop)
      .lineTo(540, footerTop)
      .stroke();

    // New Warm, Professional Thank You Message
    doc
      .fontSize(12)
      .fillColor(PRIMARY_COLOR)
      .text("Thank You For Choosing RicX Store!", 55, footerTop + 15, { align: "center", bold: true });

    doc
      .fontSize(9.5)
      .fillColor(TEXT_DARK)
      .text("We truly value your trust and support. We hope you absolute love your new premium items, and we look forward to serving you again soon.", 80, footerTop + 32, { align: "center", width: 435, lineGap: 2 });

    // Legal / Support metadata
    doc
      .fontSize(8)
      .fillColor(TEXT_LIGHT)
      .text("This is a computer-generated invoice and does not require a physical signature.", 55, footerTop + 68, { align: "center" })
      .text("For custom support or returns, reach out anytime at: support@ricxstore.com", 55, footerTop + 80, { align: "center" });

    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateInvoice,
};