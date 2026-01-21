import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  approveRestaurant,
  approveDeliveryPartner,
  getPendingRestaurants,
  getPendingDeliveryPartners
} from "../controllers/adminController.js";

const router = express.Router();

/* ===== FETCH PENDING ===== */
router.get(
  "/restaurants/pending",
  protect,
  allowRoles("admin"),
  getPendingRestaurants
);

router.get(
  "/delivery/pending",
  protect,
  allowRoles("admin"),
  getPendingDeliveryPartners
);

/* ===== APPROVE ===== */
router.put(
  "/restaurants/approve/:id",
  protect,
  allowRoles("admin"),
  approveRestaurant
);

router.put(
  "/delivery/approve/:id",
  protect,
  allowRoles("admin"),
  approveDeliveryPartner
);

export default router;
