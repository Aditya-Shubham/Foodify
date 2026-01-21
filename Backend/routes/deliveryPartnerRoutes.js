import express from "express";
import {
  registerDeliveryPartner,
  getMyDeliveryPartner
} from "../controllers/deliveryPartnerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("delivery"),
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 }
  ]),
  registerDeliveryPartner
);

router.get("/my", protect, allowRoles("delivery"), getMyDeliveryPartner);

export default router;

