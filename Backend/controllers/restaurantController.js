
import Restaurant from "../models/Restaurant.js";


/* CREATE restaurant */
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, cuisine, openTime, closeTime, menu } = req.body;

    const restaurant = await Restaurant.create({
      name,
      address,
      cuisine,
      openTime,
      closeTime,
      owner: req.user.id,
      menu // array of items
    });

    res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};

/* GET all restaurants */
export const getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find().populate("owner", "name email");
  res.json(restaurants);
};

