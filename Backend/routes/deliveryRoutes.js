// backend/routes/deliveryRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// GET all pending orders
router.get("/orders", protect, async (req, res) => {
  try {
    // Show pending orders not yet assigned
    const orders = await Order.find({ status: "pending" }).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;