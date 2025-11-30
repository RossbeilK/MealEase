// server/routes/menuItem.routes.js
import express from "express";
import {
  createMenuItem,
  getMenuItemsByRestaurant,
  updateMenuItem,
  deleteMenuItem
} from "../controllers/menuItem.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);
router.post("/", auth, createMenuItem);
router.put("/:id", auth, updateMenuItem);
router.delete("/:id", auth, deleteMenuItem);

export default router;
