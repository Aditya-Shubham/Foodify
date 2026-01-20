import express from "express";
import {
  placeOrder,
  getAvailableOrders,
  acceptOrder,
  updateOrderStatus,
  getRestaurantOrders,
  markOrderReady,
  getReadyOrders,
  assignDeliveryPartner,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/routeMiddleware.js";

const router = express.Router();

/* USER */
router.post("/", protect, allowRoles("user"), placeOrder);

/* RESTAURANT */
router.get(
  "/restaurant",
  protect,
  allowRoles("restaurant"),
  getRestaurantOrders
);

router.put(
  "/:id/ready",
  protect,
  allowRoles("restaurant"),
  markOrderReady
);

/* ADMIN */
router.get(
  "/ready",
  protect,
  allowRoles("admin"),
  getReadyOrders
);

router.put(
  "/:id/assign",
  protect,
  allowRoles("admin"),
  assignDeliveryPartner
);

/* DELIVERY */
router.get(
  "/available",
  protect,
  allowRoles("delivery"),
  getAvailableOrders
);

router.put(
  "/:id/accept",
  protect,
  allowRoles("delivery"),
  acceptOrder
);

router.put(
  "/:id/status",
  protect,
  allowRoles("delivery"),
  updateOrderStatus
);

export default router;