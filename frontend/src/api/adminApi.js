import axios from "./axios";

// Dashboard
export const getAdmins = () =>
  axios.get("/super-admin/admins");

export const getUsers = () =>
  axios.get("/super-admin/users");

export const makeAdmin = (id) =>
  axios.put(`/super-admin/make-admin/${id}`);

export const removeAdmin = (id) =>
  axios.put(`/super-admin/remove-admin/${id}`);

export const blockUser = (id) =>
  axios.put(`/super-admin/block/${id}`);

export const unblockUser = (id) =>
  axios.put(`/super-admin/unblock/${id}`);

export const updatePermissions = (id, permissions) =>
  axios.put(`/super-admin/permissions/${id}`, permissions);