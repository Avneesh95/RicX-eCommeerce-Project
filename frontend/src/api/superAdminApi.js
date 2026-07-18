import api from "./axios";

// Dashboard
export const getDashboard = () =>
  api.get("/super-admin/dashboard");

// Users
export const getUsers = () =>
  api.get("/super-admin/users");

// Admins
export const getAdmins = () =>
  api.get("/super-admin/admins");

// Promote User
export const makeAdmin = (id) =>
  api.patch(`/super-admin/promote/${id}`);

// Remove Admin
export const removeAdmin = (id) =>
  api.patch(`/super-admin/demote/${id}`);

// Block User
export const blockUser = (id) =>
  api.patch(`/super-admin/block/${id}`);

// Unblock User
export const unblockUser = (id) =>
  api.patch(`/super-admin/unblock/${id}`);