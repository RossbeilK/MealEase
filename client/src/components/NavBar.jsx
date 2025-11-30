// src/components/NavBar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.jpeg";

const NavBar = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const stored = window.localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch {
    user = null;
  }

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div
          className="nav-left"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={logoImg} alt="MealEase logo" className="nav-logo" />
          <span className="nav-title">MealEase</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>

          {user && (
            <NavLink to="/orders" className={linkClass}>
              My Orders
            </NavLink>
          )}

          {user && (
            <NavLink to="/profile" className={linkClass}>
              My Profile
            </NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/admin/restaurants" className={linkClass}>
                Restaurants
              </NavLink>
              <NavLink to="/admin/users" className={linkClass}>
                Users
              </NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign In
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Sign Up
              </NavLink>
            </>
          )}

          {user && (
            <>
              <span className="nav-user">Hi, {user.name}</span>
              <button
                className="button button-outline"
                type="button"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;