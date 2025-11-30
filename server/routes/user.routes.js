// server/routes/user.routes.js
import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";
import auth, { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// all routes below require authenticated admin
router.use(auth, requireAdmin);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;