// server/routes/auth.routes.js
import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteAccount
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// profile CRUD for currently logged-in user
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);
router.delete("/me", auth, deleteAccount);

export default router;