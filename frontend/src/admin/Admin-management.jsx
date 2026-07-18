import { useEffect, useState } from "react";
import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API = isLocalhost 
  ? "http://localhost:4000/api/super-admin" 
  : "https://ricx.onrender.com/api/super-admin";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      setLoading(true); // Ensure loading state shows during manual refreshes
      const [adminsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admins`, config),
        axios.get(`${API}/users`, config),
      ]);

      setAdmins(adminsRes.data.admins || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.log(err);

      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);

        alert(
          `${err.response.status} : ${
            err.response.data.message || "Server Error"
          }`
        );
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false); // Fixes the infinite loading spinner bug
    }
  }; // Fixed missing closing bracket here

  useEffect(() => {
    fetchData();
  }, []);

  const makeAdmin = async (id) => {
    try {
      await axios.put(`${API}/make-admin/${id}`, {}, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const removeAdmin = async (id) => {
    try {
      await axios.put(`${API}/remove-admin/${id}`, {}, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const blockUser = async (id) => {
    try {
      await axios.put(`${API}/block/${id}`, {}, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const unblockUser = async (id) => {
    try {
      await axios.put(`${API}/unblock/${id}`, {}, config);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  if (loading)
    return (
      <div className="text-center text-xl py-10">
        Loading...
      </div>
    );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          👑 Admin Management
        </h1>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {admins.map((admin) => (
                <tr
                  key={admin._id}
                  className="border-b text-center"
                >
                  <td className="p-3">{admin.name}</td>
                  <td>{admin.email}</td>
                  <td>{admin.role}</td>

                  <td>
                    {admin.role !== "superAdmin" && (
                      <button
                        onClick={() => removeAdmin(admin._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Customers
        </h2>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b text-center"
                >
                  <td className="p-3">{user.name}</td>

                  <td>{user.email}</td>

                  <td>{user.role}</td>

                  <td>
                    {user.isBlocked ? (
                      <span className="text-red-600">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="space-x-2">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => makeAdmin(user._id)}
                        className="bg-blue-600 text-white px-3 py-2 rounded"
                      >
                        Make Admin
                      </button>
                    )}

                    {user.isBlocked ? (
                      <button
                        onClick={() => unblockUser(user._id)}
                        className="bg-green-600 text-white px-3 py-2 rounded"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUser(user._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;