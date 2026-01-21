import Restaurant from "../models/Restaurant.js";

/* OWNER: Create Restaurant */
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, cuisine, openTime, closeTime, description, menu } = req.body;

    if (!req.files || !req.files["restaurantImage"] || req.files["restaurantImage"].length === 0) {
      return res.status(400).json({ success: false, message: "Restaurant image is required" });
    }

    const restaurantImage = req.files["restaurantImage"][0].filename;

    const menuImages = req.files["menuImages"] || [];
    let menuWithImages = [];

    if (menu) {
      const parsedMenu = typeof menu === "string" ? JSON.parse(menu) : menu;

      menuWithImages = parsedMenu.map((item, index) => ({
        ...item,
        image: menuImages[index]?.filename || null,
      }));
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      cuisine,
      openTime,
      closeTime,
      description,
      image: restaurantImage,
      menu: menuWithImages,
      owner: req.user.id,
      approved: false,
    });

    res.status(201).json({ success: true, message: "Restaurant registered, pending admin approval", restaurant });
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({ success: false, message: "Failed to create restaurant" });
  }
};

/* USER: Get approved restaurants */
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: true }).populate("owner", "name email");
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

/* ADMIN: Get pending restaurants */
export const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: false }).populate("owner", "name email");
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Get pending restaurants error:", error);
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

/* OWNER: Get My Restaurant */
export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });
    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Get my restaurant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
