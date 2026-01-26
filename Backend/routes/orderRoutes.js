import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js"; // ✅ FIX ADDED

import {
  placeOrder,
  getOwnerOrders,
  acceptOrder,
  markOrderReady,
  getPreparingOrdersForAdmin,
  getReadyOrdersForAdmin,
  getDeliveredOrdersForAdmin,
  markDelivered,
  getDeliveryPartnerOrders
} from "../controllers/orderController.js";

const router = express.Router();

// USER → place order
router.post("/", protect, placeOrder);

// OWNER → view orders
router.get("/owner", protect, getOwnerOrders);

// OWNER → accept order
router.patch("/:id/accept", protect, acceptOrder);

// OWNER → mark order as READY
router.patch("/:id/ready", protect, markOrderReady);

// ADMIN → view preparing orders
router.get("/admin/preparing", protect, allowRoles("admin"), getPreparingOrdersForAdmin);

// ADMIN → view READY orders
router.get("/admin/ready", protect, allowRoles("admin"), getReadyOrdersForAdmin);

// DELIVERY PARTNER → mark order delivered
router.patch(
  "/:id/delivered",
  protect,
  allowRoles("delivery"),
  markDelivered
);
// DELIVERY PARTNER → GET assigned orders
router.get(
  "/delivery/my-orders",
  protect,
  allowRoles("delivery"),
  getDeliveryPartnerOrders
);
// ADMIN → view DELIVERED orders
router.get(
  "/admin/delivered",
  protect,
  allowRoles("admin"),
  getDeliveredOrdersForAdmin
);


export default router;


