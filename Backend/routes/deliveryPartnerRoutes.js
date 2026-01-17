import express from "express";
import {
  registerDeliveryPartner,
  getMyDeliveryPartner
} from "../controllers/deliveryPartnerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("delivery"), registerDeliveryPartner);

// ✅ NEW
router.get("/my", protect, allowRoles("delivery"), getMyDeliveryPartner);

export default router;
