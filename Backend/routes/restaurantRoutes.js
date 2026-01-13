
import express from "express";
import { createRestaurant, getRestaurants } from "../controllers/restaurantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only owner can create restaurant
router.post("/", protect, allowRoles("owner"), createRestaurant);
router.get("/", getRestaurants);

export default router;

