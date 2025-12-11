// server/controllers/user.controller.js
import User from "../models/user.model.js";

// GET all users (admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET single user by id (admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// UPDATE user (admin)
export const updateUser = async (req, res) => {
  try {
    const { name, email, address, phone, role } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (address) updates.address = address;
    if (phone) updates.phone = phone;
    if (role) updates.role = role;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE user (admin)
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ message: "User deleted." });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
