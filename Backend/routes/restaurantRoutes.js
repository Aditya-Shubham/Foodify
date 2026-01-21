import express from "express";
import { createRestaurant, getRestaurants, getPendingRestaurants, getMyRestaurant } from "../controllers/restaurantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* USER: Get approved restaurants */
router.get("/", getRestaurants);

/* OWNER: Create restaurant with images */
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

/* OWNER: Get own restaurant */
router.get("/my", protect, allowRoles("owner"), getMyRestaurant);

/* ADMIN: Get pending restaurants */
router.get("/pending", protect, allowRoles("admin"), getPendingRestaurants);

export default router;
