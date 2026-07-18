import api from "./axios";

// =========================
// CREATE PAYMENT ORDER
// =========================
export const createPaymentOrder = async (orderIds) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/payment/create-order",
      { orderIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(
      "CREATE PAYMENT ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// =========================
// VERIFY PAYMENT
// =========================
export const verifyPayment = async (body) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/payment/verify",
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(
      "VERIFY PAYMENT ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// =========================
// CANCEL PENDING ORDER (Razorpay checkout closed/abandoned)
// =========================
export const cancelPendingOrder = async (orderIds) => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/payment/cancel",
      { orderIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log(
      "CANCEL ORDER ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};