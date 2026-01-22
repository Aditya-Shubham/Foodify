import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getOwnerOrders,
  acceptOrder,
  getPreparingOrdersForAdmin,
} from "../controllers/orderController.js";


const router = express.Router();

// USER → place order
router.post("/", protect, placeOrder);

// OWNER → view orders
router.get("/owner", protect, getOwnerOrders);

// OWNER → accept order
router.patch("/:id/accept", protect, acceptOrder);

// ADMIN → view preparing orders
router.get("/admin/preparing", protect, getPreparingOrdersForAdmin);

export default router;

