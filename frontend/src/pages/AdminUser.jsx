import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../api/userApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers();

      console.log("📦 FULL RESPONSE:", res);
      console.log("📦 DATA:", res.data);
      console.log("👥 USERS RAW:", res.data?.users);

      const list = res.data?.users || [];

      setUsers(list);
      setFilteredUsers(list);
    } catch (err) {
      console.error("❌ FETCH ERROR:", err.response?.data || err.message);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const keyword = search.toLowerCase();

    const filtered = users.filter((u) => {
      return (
        u?.name?.toLowerCase().includes(keyword) ||
        u?.email?.toLowerCase().includes(keyword)
      );
    });

    setFilteredUsers(filtered);
  }, [search, users]);

  // ================= ROLE UPDATE =================
  const handleRoleChange = async (id, role) => {
    try {
      setUpdatingId(id);

      console.log("🔄 ROLE UPDATE:", { id, role });

      await updateUserRole(id, role);

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, role } : user
        )
      );

      alert("Role updated successfully");
    } catch (err) {
      console.error("❌ ROLE ERROR:", err.response?.data || err.message);
      alert("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");
    if (!confirmDelete) return;

    try {
      console.log("🗑 DELETE USER:", id);

      await deleteUser(id);

      setUsers((prev) => prev.filter((u) => u._id !== id));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== id));

      alert("User deleted");
    } catch (err) {
      console.error("❌ DELETE ERROR:", err.response?.data || err.message);
      alert("Failed to delete user");
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400 text-lg">
        Loading Users...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            User Management
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all registered users.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border dark:border-gray-800 rounded-lg px-4 py-2 w-full md:w-72 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100 dark:bg-gray-950">
            <tr>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Email</th>
              <th className="text-left px-6 py-4">Role</th>
              <th className="text-left px-6 py-4">Joined</th>
              <th className="text-center px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 dark:bg-gray-950">

                  {/* NAME */}
                  <td className="px-6 py-4 font-medium">
                    {user?.name || "N/A"}
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4">
                    {user?.email || "N/A"}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      disabled={updatingId === user._id}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border dark:border-gray-800 rounded px-3 py-1"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Total Users: {filteredUsers.length}
      </div>

    </div>
  );
}