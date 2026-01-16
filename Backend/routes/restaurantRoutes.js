
import express from "express";
import { createRestaurant, getRestaurants ,getPendingRestaurants,approveRestaurant} from "../controllers/restaurantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Owner creates restaurant
router.post("/", protect, allowRoles("owner"), createRestaurant);

// User fetch restaurants (menu page)
router.get("/", getRestaurants);

// Admin fetch pending approvals
router.get(
  "/pending",
  protect,
  allowRoles("admin"),
  getPendingRestaurants);

  // Admin approves restaurant
router.put(
  "/approve/:id",
  protect,
  allowRoles("admin"),
  approveRestaurant);



export default router;

