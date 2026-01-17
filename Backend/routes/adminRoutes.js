import express from "express";
import DeliveryPartner from "../models/DeliveryPartner.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* GET PENDING DELIVERY PARTNERS */
router.get(
  "/delivery/pending",
  protect,
  allowRoles("admin"),
  async (req, res) => {
    const partners = await DeliveryPartner.find({ isApproved: false })
      .populate("user", "name email");
    res.json(partners);
  }
);

/* APPROVE DELIVERY PARTNER */
router.put(
  "/delivery/approve/:id",
  protect,
  allowRoles("admin"),
  async (req, res) => {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    partner.isApproved = true;
    await partner.save();
    res.json({ message: "Delivery partner approved" });
  }
);

export default router;
