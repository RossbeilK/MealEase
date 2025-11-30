// src/pages/HomePage.jsx
import React from "react";
import RestaurantList from "../components/RestaurantList.jsx";

const HomePage = () => {
  return (
    <div>
      <h1 className="page-title">Nearby Restaurants</h1>
      <p className="page-subtitle">
        Choose a restaurant and add dishes to your cart to place an order.
      </p>
      <RestaurantList />
    </div>
  );
};

export default HomePage;
