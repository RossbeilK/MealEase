// src/components/RestaurantDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          api.get(`/api/restaurants/${id}`),
          api.get(`/api/menuitems/restaurant/${id}`),
        ]);
        setRestaurant(restRes.data);
        setMenuItems(menuRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurant or menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((x) => x.menuItemId === item._id);
      if (existing) {
        return prev.map((x) =>
          x.menuItemId === item._id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          qty: 1,
        },
      ];
    });
  };

  const handleQtyChange = (menuItemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((x) =>
          x.menuItemId === menuItemId ? { ...x, qty: x.qty + delta } : x
        )
        .filter((x) => x.qty > 0)
    );
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePlaceOrder = async () => {
    if (!cartItems.length || !restaurant) return;
    setPlacing(true);
    setSuccessMsg("");
    try {
      const payload = {
        restaurantId: restaurant._id,
        items: cartItems.map((item) => ({
          menuItem: item.menuItemId,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
      };
      await api.post("/api/orders", payload);
      setCartItems([]);
      setSuccessMsg("Order placed successfully!");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        window.alert("Please login first.");
        navigate("/login");
      } else {
        window.alert("Failed to place order.");
      }
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  if (error) {
    return <div className="card error-text">{error}</div>;
  }

  if (!restaurant) {
    return <div className="card">Restaurant not found.</div>;
  }

  return (
    <div className="card">
      <button
        type="button"
        className="button button-outline"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "0.75rem" }}
      >
        ← Back
      </button>

      <h2 className="page-title">{restaurant.name}</h2>
      <p className="page-subtitle">
        {restaurant.cuisineType || "Food"} · {restaurant.address}
      </p>

      <h3 style={{ marginTop: "1rem", marginBottom: "0.6rem" }}>Menu</h3>
      {menuItems.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <div className="menu-list">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-item-row">
              <div className="menu-item-main">
                <div className="menu-item-name">{item.name}</div>
                {item.description && (
                  <div className="menu-item-desc">{item.description}</div>
                )}
              </div>
              <div>
                <div className="menu-item-price">
                  ${item.price?.toFixed(2)}
                </div>
                <button
                  type="button"
                  className="button button-primary"
                  style={{ marginTop: "0.25rem" }}
                  onClick={() => handleAddToCart(item)}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <h3 style={{ marginTop: 0, marginBottom: "0.4rem" }}>Cart</h3>
        {cartItems.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "#777" }}>
            No items yet. Click "Add" to choose dishes.
          </p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.menuItemId} className="cart-item-row">
                <div>
                  {item.name} × {item.qty}
                </div>
                <div>
                  <button
                    type="button"
                    className="button button-outline"
                    style={{
                      padding: "0.1rem 0.4rem",
                      marginRight: "0.25rem",
                    }}
                    onClick={() => handleQtyChange(item.menuItemId, -1)}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="button button-outline"
                    style={{
                      padding: "0.1rem 0.4rem",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => handleQtyChange(item.menuItemId, 1)}
                  >
                    +
                  </button>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.5rem",
                fontWeight: 600,
              }}
            >
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="button button-primary"
              style={{ marginTop: "0.6rem" }}
              disabled={placing}
              onClick={handlePlaceOrder}
            >
              {placing ? "Placing..." : "Place Order"}
            </button>
            {successMsg && (
              <div className="success-text" style={{ marginTop: "0.4rem" }}>
                {successMsg}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
