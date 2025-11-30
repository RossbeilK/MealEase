// server/controllers/menuItem.controller.js
import MenuItem from "../models/menuItem.model.js";

export const createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    return res.status(201).json(menuItem);
  } catch (err) {
    console.error("Create menu item error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurant: req.params.restaurantId
    });
    return res.json(items);
  } catch (err) {
    console.error("Get menu items error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }
    return res.json(menuItem);
  } catch (err) {
    console.error("Update menu item error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }
    return res.json({ message: "Menu item deleted." });
  } catch (err) {
    console.error("Delete menu item error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
