// src/pages/ManageRestaurantsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  name: "",
  address: "",
  cuisineType: "",
  isOpen: true
};

const ManageRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // null | "new" | restaurantId
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  let user = null;
  try {
    const stored = window.localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await api.get("/api/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
  };

  const startEdit = (restaurant) => {
    setEditingId(restaurant._id);
    setForm({
      name: restaurant.name || "",
      address: restaurant.address || "",
      cuisineType: restaurant.cuisineType || "",
      isOpen: restaurant.isOpen !== undefined ? restaurant.isOpen : true
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId === "new") {
        const res = await api.post("/api/restaurants", form);
        setRestaurants((prev) => [res.data, ...prev]);
      } else {
        const res = await api.put(`/api/restaurants/${editingId}`, form);
        setRestaurants((prev) =>
          prev.map((r) => (r._id === editingId ? res.data : r))
        );
      }
      cancelEdit();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save restaurant.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;

    try {
      await api.delete(`/api/restaurants/${id}`);
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete restaurant.");
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  return (
    <div>
      <h1 className="page-title">Manage Restaurants</h1>
      <p className="page-subtitle">
        Create, update, and delete restaurants available on MealEase.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <button className="button button-primary" onClick={startCreate}>
          + Add Restaurant
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      {editingId && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2>{editingId === "new" ? "Create Restaurant" : "Edit Restaurant"}</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cuisine Type</label>
              <input
                name="cuisineType"
                value={form.cuisineType}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={form.isOpen}
                  onChange={handleChange}
                  style={{ marginRight: "0.5rem" }}
                />
                Is Open
              </label>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                className="button button-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="button button-outline"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2>Current Restaurants</h2>
        {restaurants.length === 0 ? (
          <p>No restaurants yet.</p>
        ) : (
          <div className="grid">
            {restaurants.map((r) => (
              <div key={r._id} className="restaurant-card">
                <div className="restaurant-card-name">{r.name}</div>
                <div className="restaurant-card-meta">
                  {r.cuisineType || "Food"} · {r.address}
                </div>
                <div className="badge">
                  {r.isOpen ? "Open" : "Closed"}
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  <button
                    className="button button-small"
                    type="button"
                    onClick={() => startEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-outline button-small"
                    type="button"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRestaurantsPage;