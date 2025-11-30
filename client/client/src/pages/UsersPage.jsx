// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let currentUser = null;
  try {
    const stored = window.localStorage.getItem("user");
    currentUser = stored ? JSON.parse(stored) : null;
  } catch {
    currentUser = null;
  }

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get("/api/users");
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await api.put(`/api/users/${id}`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update role.");
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <p className="page-subtitle">
        View and manage all MealEase users (admin only).
      </p>

      {error && <div className="error-text">{error}</div>}

      <div className="card">
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.address}</td>
                    <td>{u.phone}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {u.role === "admin" ? (
                        <button
                          className="button button-small"
                          type="button"
                          onClick={() => handleRoleChange(u._id, "customer")}
                        >
                          Make Customer
                        </button>
                      ) : (
                        <button
                          className="button button-small"
                          type="button"
                          onClick={() => handleRoleChange(u._id, "admin")}
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        className="button button-outline button-small"
                        type="button"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
