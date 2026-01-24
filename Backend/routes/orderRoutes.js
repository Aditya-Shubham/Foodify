import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js"; // ✅ FIX ADDED
import Order from "../models/Order.js"; 
import DeliveryPartner from "../models/DeliveryPartner.js";
import {
  placeOrder,
  getOwnerOrders,
  acceptOrder,
  markOrderReady,
  getPreparingOrdersForAdmin,
  getReadyOrdersForAdmin,
  markDelivered,
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
  allowRoles("delivery"),  // only delivery partners can access
  async (req, res) => {
    try {
      // First, get the DeliveryPartner ID of the logged-in user
      const partner = await DeliveryPartner.findOne({ user: req.user.id });
      if (!partner) {
        return res.status(404).json({ message: "Delivery partner profile not found" });
      }

      // Fetch orders assigned to this partner
      const orders = await Order.find({ deliveryPartner: partner._id })
        .populate("restaurant", "name")
        .populate("user", "name email");

      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch delivery partner orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }
);


export default router;


