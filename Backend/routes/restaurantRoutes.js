import express from "express";
import { createRestaurant, getRestaurants } from "../controllers/restaurantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/routeMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// GET all restaurants
router.get("/", getRestaurants);

// CREATE restaurant with images
router.post(
  "/",
  protect,
  allowRoles("owner"),
  upload.fields([
    { name: "restaurantImage", maxCount: 1 },
    { name: "menuImages", maxCount: 10 },
  ]),
  createRestaurant
);

export default router;