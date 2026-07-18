import api from "./axios";

// ==========================
// PLACE ORDER (Cart Checkout)
// ==========================
export const placeOrder = async (orderData) => {
  return await api.post("/order/place", orderData);
};

// ==========================
// BUY NOW ORDER (NEW)
// ==========================
export const buyNowOrder = async (orderData) => {
  return await api.post("/order/buy-now", orderData);
};

// ==========================
// GET MY ORDERS
// ==========================
export const getMyOrders = async () => {
  return await api.get("/order/my");
};

// ==========================
// GET SINGLE ORDER
// ==========================
export const getOrderById = async (id) => {
  return await api.get(`/order/${id}`);
};

// ==========================
// CANCEL ORDER
// ==========================
export const cancelOrder = async (id) => {
  return await api.put(`/order/cancel/${id}`);
};

// ==========================
// GET ALL ORDERS (ADMIN)
// ==========================
export const getAllOrders = async () => {
  return api.get("/order");
};

// ==========================
// UPDATE ORDER STATUS (ADMIN)
// ==========================
export const updateOrderStatus = async (id, status) => {
  return await api.put(`/order/${id}`, {
    status,
  });
};
// ==========================
// DELETE ORDER (ADMIN)
// ==========================
export const deleteOrder = async (id) => {
  return await api.delete(`/order/${id}`);
};

// ==========================
// DOWNLOAD INVOICE (PDF)
// ==========================
export const downloadInvoice = async (id) => {
  return await api.get(`/invoice/${id}`, {
    responseType: "blob",
  });
};