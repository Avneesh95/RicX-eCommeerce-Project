import api from "./axios";

// =========================
// GET PRODUCTS (supports search & advanced filters)
// =========================
// filters: { search, category, sort, minPrice, maxPrice, minRating }
export const getProducts = (page = 1, limit = 8, filters = {}) => {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("limit", limit);

  if (filters.search) params.set("search", filters.search);
  if (filters.category && filters.category !== "All")
    params.set("category", filters.category);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.minPrice != null) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice != null) params.set("maxPrice", filters.maxPrice);
  if (filters.minRating != null) params.set("minRating", filters.minRating);
  if (filters.seller) params.set("seller", filters.seller);

  return api.get(`/products?${params.toString()}`);
};

// =========================
// GET SINGLE PRODUCT
// =========================
export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

// =========================
// GET RELATED PRODUCTS ("you may also like")
// =========================
export const getRelatedProducts = (id, limit = 6) => {
  return api.get(`/products/${id}/related?limit=${limit}`);
};

// =========================
// CREATE PRODUCT
// =========================
export const createProduct = (formData) => {
  return api.post("/products/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================
// UPDATE PRODUCT
// =========================
export const updateProduct = (id, formData) => {
  return api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================
// DELETE PRODUCT
// =========================
export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export const bulkUploadProducts = (formData) => {
  return api.post("/products/bulk-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// =========================
// DOWNLOAD SAMPLE BULK-UPLOAD TEMPLATE
// =========================
export const downloadSampleTemplate = () => {
  return api.get("/products/bulk-upload/sample", {
    responseType: "blob",
  });
};
