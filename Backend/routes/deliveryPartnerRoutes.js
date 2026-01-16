import express from "express";
import { registerDeliveryPartner } from "../controllers/deliveryPartnerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only delivery role allowed
router.post("/", protect, allowRoles("delivery"), registerDeliveryPartner);

export default router;
