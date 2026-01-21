import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import deliveryPartnerRoutes from "./routes/deliveryPartnerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery-partners", deliveryPartnerRoutes);
app.use("/api/user", userRoutes);

// serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Foodify API Running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
