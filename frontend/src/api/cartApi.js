import api from "../api/axios";

export const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem("token");

  return api.post(
    "/cart/add",
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCart = async () => {
  const token = localStorage.getItem("token");

  return api.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCart = async (productId, quantity) => {
  const token = localStorage.getItem("token");

  return api.put(
    "/cart/update",
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeCartItem = async (productId) => {
  const token = localStorage.getItem("token");

  return api.delete(`/cart/remove/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};