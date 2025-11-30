// src/pages/MyProfilePage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const MyProfilePage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        const res = await api.get("/auth/me");
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          address: res.data.address || "",
          phone: res.data.phone || ""
        });
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name,
        address: form.address,
        phone: form.phone
        // you can add password update here if you want
      };

      const res = await api.put("/auth/me", payload);

      // update localStorage user with new profile
      try {
        const stored = window.localStorage.getItem("user");
        const oldUser = stored ? JSON.parse(stored) : {};
        const updatedUser = {
          ...oldUser,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role || oldUser.role
        };
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch {
        // ignore
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">
        View and update your MealEase account details.
      </p>

      <div className="card">
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
            <label className="form-label">Email (read only)</label>
            <input value={form.email} disabled />
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
            <label className="form-label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>

          {/* Optional: add password change fields if required by your team */}

          {error && <div className="error-text">{error}</div>}
          {success && <div className="success-text">{success}</div>}

          <button
            type="submit"
            className="button button-primary"
            style={{ width: "100%", marginTop: "0.75rem" }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;