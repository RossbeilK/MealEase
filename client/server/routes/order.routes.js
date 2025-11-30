// server/routes/order.routes.js
import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

export default router;
