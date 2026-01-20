import express from "express";
import { signup, login,signupDelivery } from "../controllers/authController.js";
import multer from "multer";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Regular signup/login
router.post("/signup", signup);
router.post("/login", login);

// Delivery partner signup (with files)
router.post(
  "/signup-delivery",
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
  ]),
  signupDelivery // New controller
);

export default router;