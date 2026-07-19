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
      `attachment; filename=RicX-Invoice-${order._id}.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Colors
    const PRIMARY = "#111827";
    const SECONDARY = "#6B7280";
    const BORDER = "#E5E7EB";
    const SUCCESS = "#10B981";
    const LIGHT = "#F9FAFB";

    // Generate invoice number
    const invoiceNumber = `RCX-${new Date().getFullYear()}${String(
      new Date().getMonth() + 1,
    ).padStart(2, "0")}${String(new Date().getDate()).padStart(
      2,
      "0",
    )}-${order._id.toString().slice(-5).toUpperCase()}`;

    // ================= HEADER =================
    doc
      .fillColor(PRIMARY)
      .font("Helvetica-Bold")
      .fontSize(28)
      .text("RicX", 50, 50);

    doc
      .fillColor(SECONDARY)
      .font("Helvetica")
      .fontSize(10)
      .text("Premium Online Shopping", 50, 85);

    doc
      .fillColor(PRIMARY)
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("INVOICE", 400, 50, { align: "right" });

    doc
      .fillColor(SECONDARY)
      .font("Helvetica")
      .fontSize(10)
      .text(`Invoice No: ${invoiceNumber}`, 350, 85, { align: "right" })
      .text(
        `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
        350,
        100,
        { align: "right" },
      );

    // Divider
    doc
      .strokeColor(BORDER)
      .lineWidth(1)
      .moveTo(50, 130)
      .lineTo(545, 130)
      .stroke();

    // ================= CUSTOMER & SHIPPING =================
    const top = 150;

    // Customer
    doc
      .fillColor(PRIMARY)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Customer Details", 50, top);

    doc
      .fillColor(PRIMARY)
      .font("Helvetica")
      .fontSize(10)
      .text(order.user?.name || "Customer", 50, top + 22)
      .text(order.user?.email || "N/A", 50, top + 38)
      .text(order.shippingAddress?.phone || "N/A", 50, top + 54);

    // Shipping
    doc
      .fillColor(PRIMARY)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Shipping Address", 320, top);

    doc
      .fillColor(PRIMARY)
      .font("Helvetica")
      .fontSize(10)
      .text(order.shippingAddress?.fullName || "N/A", 320, top + 22)
      .text(order.shippingAddress?.address || "N/A", 320, top + 38, {
        width: 200,
      })
      .text(
        `${order.shippingAddress?.city || ""}, ${
          order.shippingAddress?.state || ""
        }`,
        320,
        top + 68,
      )
      .text(
        `${order.shippingAddress?.country || ""} - ${
          order.shippingAddress?.pincode || ""
        }`,
        320,
        top + 84,
      );

    // Divider
    doc.strokeColor(BORDER).moveTo(50, 275).lineTo(545, 275).stroke();

    // ================= ORDER INFO =================
    doc
      .fillColor(SECONDARY)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`Payment Method: ${order.paymentMethod}`, 50, 290);

    // Payment badge
    doc.circle(445, 297, 4).fill(SUCCESS);

    doc
      .fillColor(SUCCESS)
      .font("Helvetica-Bold")
      .text(order.paymentStatus?.toUpperCase() || "PENDING", 455, 290);

    doc
      .fillColor(SECONDARY)
      .font("Helvetica-Bold")
      .text(`Order Status: ${order.status?.toUpperCase()}`, 50, 310);

    // ================= TABLE HEADER =================
    let y = 350;

    doc.rect(50, y, 495, 26).fill(PRIMARY);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Product", 60, y + 8)
      .text("Qty", 340, y + 8, { width: 40, align: "center" })
      .text("Price", 410, y + 8, { width: 60, align: "right" })
      .text("Total", 480, y + 8, { width: 55, align: "right" });

    y += 26;

  // ================= PRODUCTS =================
    doc.font("Helvetica").fontSize(10);

    order.orderItems.forEach((item, index) => {
      const rowHeight = 32;
      const total = item.quantity * item.price;

      // Check if row goes past layout thresholds to avoid overflow
      if (y + rowHeight > 700) {
        doc.addPage();
        y = 50; // Reset Y position on new page
      }

      if (index % 2 === 0) {
        doc.rect(50, y, 495, rowHeight).fill(LIGHT);
      }

      doc
        .fillColor(PRIMARY)
        .text(item.product?.name || "Product", 60, y + 10, {
          width: 250,
        })
        .text(String(item.quantity), 340, y + 10, {
          width: 40,
          align: "center",
        })
        .text(`Rs. ${item.price.toLocaleString("en-IN")}`, 410, y + 10, {
          width: 60,
          align: "right",
        })
        .text(`Rs. ${total.toLocaleString("en-IN")}`, 480, y + 10, {
          width: 55,
          align: "right",
        });

      y += rowHeight;
    });

    // Divider
    doc
      .strokeColor(BORDER)
      .moveTo(50, y + 5)
      .lineTo(545, y + 5)
      .stroke();

    // ================= SUMMARY =================
    const subtotal = order.totalAmount;
    const shipping = 0;
    const discount = 0;
    const tax = 0;

    let boxY = y + 25;
    
    // Check if summary box clashes with footer placement
    if (boxY + 140 > 720) {
      doc.addPage();
      boxY = 50;
    }

    doc.rect(330, boxY, 215, 140).fill(LIGHT); // Increased slightly to safely fit the larger TOTAL font size

    doc
      .fillColor(PRIMARY)
      .font("Helvetica")
      .fontSize(10)
      .text("Subtotal", 350, boxY + 18)
      .text(`Rs. ${subtotal.toLocaleString("en-IN")}`, 430, boxY + 18, {
        width: 95,
        align: "right",
      });

    doc
      .text("Shipping", 350, boxY + 40)
      .text(
        shipping === 0 ? "FREE" : `Rs. ${shipping.toLocaleString("en-IN")}`,
        430,
        boxY + 40,
        {
          width: 95,
          align: "right",
        },
      );

    doc
      .text("Discount", 350, boxY + 62)
      .text(`-Rs. ${discount.toLocaleString("en-IN")}`, 430, boxY + 62, {
        width: 95,
        align: "right",
      });

    doc
      .text("Tax", 350, boxY + 84)
      .text(`Rs. ${tax.toLocaleString("en-IN")}`, 430, boxY + 84, {
        width: 95,
        align: "right",
      });

    doc
      .strokeColor(BORDER)
      .moveTo(345, boxY + 102)
      .lineTo(525, boxY + 102)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(PRIMARY)
      .text("TOTAL", 350, boxY + 112)
      .fillColor(SUCCESS)
      .text(
        `Rs. ${order.totalAmount.toLocaleString("en-IN")}`,
        430,
        boxY + 112,
        {
          width: 95,
          align: "right",
        },
      );

    // ================= FOOTER =================
    const footerY = 720;

    doc.strokeColor(BORDER).moveTo(50, footerY).lineTo(545, footerY).stroke();

    doc
      .fillColor(PRIMARY)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Thank you for shopping with RicX ❤️", 50, footerY + 18, {
        align: "center",
      });

    doc
      .fillColor(SECONDARY)
      .font("Helvetica")
      .fontSize(9)
      .text(
        "Need help? ricx.ecommerce@gmail.com | www.ricxstore.com",
        50,
        footerY + 42,
        {
          align: "center",
        },
      )
      .text(
        "This is a computer-generated invoice and does not require a signature.",
        50,
        footerY + 58,
        { align: "center" },
      );

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