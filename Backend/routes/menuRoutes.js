// routes/menuRoutes.js
import express from "express";
import Restaurant from "../models/Restaurant.js";

const router = express.Router();

router.get("/menu", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    const menu = await Promise.all(
      restaurants.map(async (rest) => {
        const foods = await Food.find({ restaurant: rest._id });
        return {
          restaurant: rest,
          foods,
        };
      })
    );

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;