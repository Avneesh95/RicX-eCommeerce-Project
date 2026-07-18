import api from "./axios";

// 1. Define the named function expression
export const getAnalytics = async () => {
  return await api.get("/admin/analytics");
};

// 2. Provide a default export container object as a fallback shield
const analyticsApi = {
  getAnalytics
};

export default analyticsApi;