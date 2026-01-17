
import express from "express";
import { createRestaurant, getRestaurants ,getPendingRestaurants,getMyRestaurant} from "../controllers/restaurantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// Owner creates restaurant
router.post("/", protect, allowRoles("owner"), createRestaurant);

// User fetch restaurants (menu page)
router.get("/", getRestaurants);

// Owner: check own restaurant status
router.get(
  "/my",
  protect,
  allowRoles("owner"),
  getMyRestaurant
);

// Admin fetch pending approvals
router.get(
  "/pending",
  protect,
  allowRoles("admin"),
  getPendingRestaurants);

  



export default router;

