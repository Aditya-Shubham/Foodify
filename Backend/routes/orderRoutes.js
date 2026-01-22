import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getOwnerOrders,
} from "../controllers/orderController.js";

const router = express.Router();

// USER → place order
router.post("/", protect, placeOrder);

// OWNER → view orders
router.get("/owner", protect, getOwnerOrders);

export default router;

