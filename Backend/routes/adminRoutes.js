import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/orders/ready", protect, adminOnly, async (req, res) => {
  const orders = await Order.find({ status: "READY" })
    .populate("restaurant", "name")
    .populate("user", "name");

  res.json(orders);
});
router.put("/orders/:id/assign", protect, adminOnly, async (req, res) => {
  const { deliveryPartnerId } = req.body;

  const order = await Order.findById(req.params.id);
  order.deliveryPartner = deliveryPartnerId;
  order.status = "OUT_FOR_DELIVERY";

  await order.save();
  res.json(order);
});

export default router;