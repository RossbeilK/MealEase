// server/controllers/order.controller.js
import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required." });
    }

    const totalPrice = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.qty || 1),
      0
    );

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      totalPrice
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("Get my orders error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "restaurant",
      "name"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    return res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update status." });
    }

    order.status = status || order.status;
    await order.save();

    return res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};
