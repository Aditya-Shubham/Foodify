import express from "express";
import {
  getProfile,
  updateProfile,
  saveAddresses
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/addresses", protect, saveAddresses);

export default router;
