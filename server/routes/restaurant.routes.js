// server/routes/restaurant.routes.js
import express from "express";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from "../controllers/restaurant.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRestaurants);
router.post("/", auth, createRestaurant);
router.get("/:id", getRestaurantById);
router.put("/:id", auth, updateRestaurant);
router.delete("/:id", auth, deleteRestaurant);

export default router;
//2602842404jrf_db_user
//pBQRwiPwt2u7DhBn