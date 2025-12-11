// src/pages/ManageRestaurantsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../api";

// 用于重置餐厅表单
const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

const emptyRestaurantForm = {
  name: "",
  address: "",
  phone: "",
  cuisineType: "",
  imageUrl: "",
  isOpen: true,
};

// 用于重置菜单表单
const emptyMenuForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  isAvailable: true,
};

const ManageRestaurantsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(window.localStorage.getItem("user") || "null");

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 餐厅 CRUD 状态
  const [restaurantForm, setRestaurantForm] = useState(emptyRestaurantForm);
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);
  const [savingRestaurant, setSavingRestaurant] = useState(false);

  // 菜单 CRUD 状态（针对选中的餐厅）
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState(emptyMenuForm);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [savingMenu, setSavingMenu] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // 不是 admin 直接回到首页
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/restaurants");
        const data = res.data || [];
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurantId(data[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [navigate]);

  // 当选中的餐厅变化时，加载对应菜单
  useEffect(() => {
    const loadMenu = async () => {
      if (!selectedRestaurantId) {
        setMenuItems([]);
        return;
      }
      try {
        const res = await api.get(
          `/api/menuitems/restaurant/${selectedRestaurantId}`
        );
        setMenuItems(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu items.");
      }
    };

    loadMenu();
  }, [selectedRestaurantId]);

  // ---------- 餐厅 CRUD ----------
  const handleRestaurantFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurantForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurantId(restaurant._id);
    setRestaurantForm({
      name: restaurant.name || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      cuisineType: restaurant.cuisineType || "",
      imageUrl: restaurant.imageUrl || "",
      isOpen: restaurant.isOpen ?? true,
    });
  };

  const handleCancelRestaurantEdit = () => {
    setEditingRestaurantId(null);
    setRestaurantForm(emptyRestaurantForm);
  };

  const handleSaveRestaurant = async (e) => {
    e.preventDefault();
    setSavingRestaurant(true);
    setError("");

    const payload = {
      name: restaurantForm.name.trim(),
      address: restaurantForm.address.trim(),
      phone: restaurantForm.phone.trim(),
      cuisineType: restaurantForm.cuisineType.trim(),
      imageUrl: restaurantForm.imageUrl.trim(),
      isOpen: restaurantForm.isOpen,
    };

    if (!payload.name || !payload.address) {
      setError("Please enter restaurant name and address.");
      setSavingRestaurant(false);
      return;
    }

    try {
      if (editingRestaurantId) {
        await api.put(`/api/restaurants/${editingRestaurantId}`, payload);
      } else {
        await api.post("/api/restaurants", payload);
      }

      const res = await api.get("/api/restaurants");
      const data = res.data || [];
      setRestaurants(data);

      if (!selectedRestaurantId && data.length > 0) {
        setSelectedRestaurantId(data[0]._id);
      }

      setRestaurantForm(emptyRestaurantForm);
      setEditingRestaurantId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save restaurant.");
    } finally {
      setSavingRestaurant(false);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await api.delete(`/api/restaurants/${id}`);
      const filtered = restaurants.filter((r) => r._id !== id);
      setRestaurants(filtered);

      if (selectedRestaurantId === id) {
        setSelectedRestaurantId(filtered[0]?._id || "");
        setMenuItems([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete restaurant.");
    }
  };

  const handleRestaurantSelectChange = (e) => {
    setSelectedRestaurantId(e.target.value);
    setEditingMenuId(null);
    setMenuForm(emptyMenuForm);
  };

  // ---------- 菜单 CRUD ----------
  const handleMenuFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditMenuItem = (item) => {
    setEditingMenuId(item._id);
    setMenuForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price != null ? String(item.price) : "",
      imageUrl: item.imageUrl || "",
      isAvailable: item.isAvailable ?? true,
    });
  };

  const handleCancelMenuEdit = () => {
    setEditingMenuId(null);
    setMenuForm(emptyMenuForm);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    if (!selectedRestaurantId) {
      setError("Please select a restaurant first.");
      return;
    }
    setSavingMenu(true);
    setError("");

    const payload = {
      restaurant: selectedRestaurantId,
      name: menuForm.name.trim(),
      description: menuForm.description.trim(),
      price: Number(menuForm.price),
      imageUrl: menuForm.imageUrl.trim(),
      isAvailable: menuForm.isAvailable,
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      setError("Please enter a valid name and price for the menu item.");
      setSavingMenu(false);
      return;
    }

    try {
      if (editingMenuId) {
        await api.put(`/api/menuitems/${editingMenuId}`, payload);
      } else {
        await api.post("/api/menuitems", payload);
      }

      const res = await api.get(
        `/api/menuitems/restaurant/${selectedRestaurantId}`
      );
      setMenuItems(res.data || []);
      setMenuForm(emptyMenuForm);
      setEditingMenuId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save menu item.");
    } finally {
      setSavingMenu(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await api.delete(`/api/menuitems/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete menu item.");
    }
  };

  // ---------- 图片上传（本地文件 -> /api/upload） ----------
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { imageUrl } = res.data;
      setMenuForm((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      console.error(err);
      setError("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="card" style={{ margin: "1rem auto" }}>
      <h1 className="page-title">Manage Restaurants &amp; Menus</h1>
      {error && (
        <div className="error-text" style={{ marginBottom: "0.75rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-layout">
          {/* 左边：餐厅 CRUD */}
          <section className="admin-panel">
            <h2>Restaurants</h2>

            <form onSubmit={handleSaveRestaurant}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  value={restaurantForm.name}
                  onChange={handleRestaurantFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  name="address"
                  value={restaurantForm.address}
                  onChange={handleRestaurantFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  value={restaurantForm.phone}
                  onChange={handleRestaurantFormChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cuisine type</label>
                <input
                  name="cuisineType"
                  value={restaurantForm.cuisineType}
                  onChange={handleRestaurantFormChange}
                  placeholder="Chinese, Pizza, Coffee..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL (optional)</label>
                <input
                  name="imageUrl"
                  value={restaurantForm.imageUrl}
                  onChange={handleRestaurantFormChange}
                  placeholder="https://example.com/restaurant.jpg"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload image from computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRestaurantImageUpload}
                />
                {uploadingImage && (
                  <p style={{ fontSize: "0.8rem" }}>Uploading image...</p>
                )}
                {restaurantForm.imageUrl && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginRight: "0.5rem",
                      }}
                    >
                      Preview:
                    </span>
                    <img
                      src={resolveImageUrl(restaurantForm.imageUrl)}
                      alt="preview"
                      style={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: "0.75rem",
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className="form-group"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <input
                  id="rest-isOpen"
                  type="checkbox"
                  name="isOpen"
                  checked={restaurantForm.isOpen}
                  onChange={handleRestaurantFormChange}
                />
                <label
                  htmlFor="rest-isOpen"
                  className="form-label"
                  style={{ margin: 0 }}
                >
                  Open
                </label>
              </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                type="submit"
                className="button button-primary"
                disabled={savingRestaurant}
              >
                {editingRestaurantId ? "Update restaurant" : "Add restaurant"}
              </button>
              {editingRestaurantId && (
                <button
                  type="button"
                  className="button button-outline"
                  onClick={handleCancelRestaurantEdit}
                >
                  Cancel
                </button>
              )}
            </div>
            </form>

            <h3 style={{ marginTop: "1rem" }}>Existing restaurants</h3>
            {restaurants.length === 0 ? (
              <p>No restaurants yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Cuisine</th>
                    <th>Open</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((r) => (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.cuisineType || "-"}</td>
                      <td>{r.isOpen ? "Yes" : "No"}</td>
                      <td>
                        <div className="data-table-actions">
                          <button
                            type="button"
                            className="button button-outline"
                            onClick={() => handleEditRestaurant(r)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button button-outline"
                            onClick={() => handleDeleteRestaurant(r._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* 右边：菜单 CRUD */}
          <section className="admin-panel">
            <h2>Menu for selected restaurant</h2>

            <div className="form-group">
              <label className="form-label">Select restaurant</label>
              <select
                value={selectedRestaurantId}
                onChange={handleRestaurantSelectChange}
              >
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSaveMenuItem}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  value={menuForm.name}
                  onChange={handleMenuFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={menuForm.description}
                  onChange={handleMenuFormChange}
                  rows={2}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={menuForm.price}
                  onChange={handleMenuFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Image URL (optional, will override uploaded)
                </label>
                <input
                  name="imageUrl"
                  value={menuForm.imageUrl}
                  onChange={handleMenuFormChange}
                  placeholder="/uploads/xxx.jpg or https://..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload image from computer</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {uploadingImage && (
                  <p style={{ fontSize: "0.8rem" }}>Uploading image...</p>
                )}
                {menuForm.imageUrl && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        marginRight: "0.5rem",
                      }}
                    >
                      Preview:
                    </span>
                    <img
                      src={resolveImageUrl(menuForm.imageUrl)}
                      alt="preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: "0.75rem",
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className="form-group"
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <input
                  id="menu-isAvailable"
                  type="checkbox"
                  name="isAvailable"
                  checked={menuForm.isAvailable}
                  onChange={handleMenuFormChange}
                />
                <label
                  htmlFor="menu-isAvailable"
                  className="form-label"
                  style={{ margin: 0 }}
                >
                  Available
                </label>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={savingMenu}
                >
                  {editingMenuId ? "Update item" : "Add item"}
                </button>
                {editingMenuId && (
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={handleCancelMenuEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h3 style={{ marginTop: "1rem" }}>Existing menu items</h3>
            {menuItems.length === 0 ? (
              <p>No menu items for this restaurant yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {item.name}
                        {item.imageUrl && (
                          <div className="badge-muted">Has image</div>
                        )}
                      </td>
                      <td>${item.price?.toFixed(2)}</td>
                      <td>{item.isAvailable ? "Yes" : "No"}</td>
                      <td>
                        <div className="data-table-actions">
                          <button
                            type="button"
                            className="button button-outline"
                            onClick={() => handleEditMenuItem(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="button button-outline"
                            onClick={() => handleDeleteMenuItem(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
  const handleRestaurantImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { imageUrl } = res.data;
      setRestaurantForm((prev) => ({ ...prev, imageUrl }));
    } catch (err) {
      console.error(err);
      setError("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };


export default ManageRestaurantsPage;
