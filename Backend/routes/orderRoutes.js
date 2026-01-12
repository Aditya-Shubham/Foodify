import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const order = await Order.create({
    user: req.user.id,
    items: req.body.items,
    totalAmount: req.body.total,
    paymentMethod: req.body.paymentMethod
  });

  res.json(order);
});

router.get("/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

export default router;
