// server/controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../../config/config.js";

// REGISTER (Create User)
export const register = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // If this is the first user, you *could* make them admin.
    // Here we keep it simple: default role = "customer".
    const user = await User.create({
      name,
      email,
      passwordHash,
      address,
      phone,
      role: "customer",
    });

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });

    return res.json({
      token,
      user: payload,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// READ CURRENT USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// UPDATE CURRENT USER PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, address, phone, password } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (address) updates.address = address;
    if (phone) updates.phone = phone;

    if (password) {
      updates.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// DELETE CURRENT USER ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json({ message: "Account deleted." });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
