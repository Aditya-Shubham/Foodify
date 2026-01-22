import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getOwnerOrders,
  acceptOrder,
  markOrderReady,
  getPreparingOrdersForAdmin,
  getReadyOrdersForAdmin,
} from "../controllers/orderController.js";

const router = express.Router();

// USER → place order
router.post("/", protect, placeOrder);

// OWNER → view orders
router.get("/owner", protect, getOwnerOrders);

// OWNER → accept order
router.patch("/:id/accept", protect, acceptOrder);

// OWNER → mark order as READY for delivery
router.patch("/:id/ready", protect, markOrderReady);

// ADMIN → view preparing orders
router.get("/admin/preparing", protect, getPreparingOrdersForAdmin);

// ADMIN → view READY orders
router.get("/admin/ready", protect, getReadyOrdersForAdmin);

export default router;

