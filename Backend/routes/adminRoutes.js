
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  approveRestaurant,
  approveDeliveryPartner
} from "../controllers/adminController.js";

const router = express.Router();

router.put("/restaurants/approve/:id", protect, allowRoles("admin"), approveRestaurant);
router.put("/delivery/approve/:id", protect, allowRoles("admin"), approveDeliveryPartner);

export default router;
