// src/components/RestaurantList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { API_BASE_URL } from "../api";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url}`;
};

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurants.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="card">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="card error-text">{error}</div>;
  }

  if (!restaurants.length) {
    return <div className="card">No restaurants yet.</div>;
  }

  return (
    <div className="restaurant-grid">
      {restaurants.map((r) => (
        <div
          key={r._id}
          className="card"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/restaurants/${r._id}`)}
        >
          {r.imageUrl && (
            <div className="restaurant-card-image-wrapper">
              <img
                src={resolveImageUrl(r.imageUrl)}
                alt={r.name}
                className="restaurant-card-image"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
          <div className="restaurant-card-name">{r.name}</div>
          <div className="restaurant-card-meta">
            {r.cuisineType || "Food"} · {r.address}
          </div>
          {r.isOpen !== undefined && (
            <div className="badge">{r.isOpen ? "Open" : "Closed"}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RestaurantList;
