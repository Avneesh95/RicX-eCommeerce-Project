import api from "./axios";

// ===============================
// GET ALL USERS
// ===============================
export const getUsers = async () => {
     console.log("Calling /admin/users");
  return await api.get("/admin/users");


};


// ===============================
// CHANGE USER ROLE
// ===============================
export const updateUserRole = async (id, role) => {
  return await api.put(`/admin/users/${id}/role`, {
    role,
  });
};

// ===============================
// DELETE USER
// ===============================
export const deleteUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};