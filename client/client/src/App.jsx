// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import ManageRestaurantsPage from "./pages/ManageRestaurantsPage.jsx";
import MyProfilePage from "./pages/MyProfilePage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import RestaurantDetail from "./components/RestaurantDetail.jsx";

const App = () => {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/admin/restaurants" element={<ManageRestaurantsPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        </Routes>
      </main>
      <footer>
        © {new Date().getFullYear()} MEALEASE · Second Release (Part 3)
      </footer>
    </div>
  );
};

export default App;
