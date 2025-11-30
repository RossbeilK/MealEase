// server/controllers/restaurant.controller.js
import Restaurant from "../models/restaurant.model.js";

export const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    return res.status(201).json(restaurant);
  } catch (err) {
    console.error("Create restaurant error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    return res.json(restaurants);
  } catch (err) {
    console.error("Get restaurants error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    return res.json(restaurant);
  } catch (err) {
    console.error("Get restaurant error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    return res.json(restaurant);
  } catch (err) {
    console.error("Update restaurant error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }
    return res.json({ message: "Restaurant deleted." });
  } catch (err) {
    console.error("Delete restaurant error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
