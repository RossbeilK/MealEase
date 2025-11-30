// src/pages/MyOrdersPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/orders/my");
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setError("Please login to see your orders.");
        } else {
          setError("Failed to load orders.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="card">Loading orders...</div>;
  }

  if (error) {
    return <div className="card error-text">{error}</div>;
  }

  if (!orders.length) {
    return <div className="card">You have no orders yet.</div>;
  }

  return (
    <div className="card">
      <h1 className="page-title">My Orders</h1>
      <div
        style={{
          fontSize: "0.85rem",
          color: "#777",
          marginBottom: "0.7rem",
        }}
      >
        Latest orders shown first.
      </div>
      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            style={{
              padding: "0.6rem 0",
              borderBottom: "1px solid #eee",
              fontSize: "0.9rem",
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {order.restaurant?.name || "Restaurant"}
            </div>
            <div>Status: {order.status}</div>
            <div>Total: ${order.totalPrice?.toFixed(2)}</div>
            <div style={{ color: "#777" }}>
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
