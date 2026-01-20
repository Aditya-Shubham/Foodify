import Restaurant from "../models/Restaurant.js";

/* CREATE restaurant */
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, description, menu } = req.body;

    // ✅ Check restaurant image
    if (!req.files || !req.files['restaurantImage'] || req.files['restaurantImage'].length === 0) {
      return res.status(400).json({ message: "Restaurant image is required" });
    }
    const restaurantImage = req.files['restaurantImage'][0].filename;

    // Menu images
    const menuImages = req.files['menuImages'] || [];
    let menuWithImages = [];

    if (menu) {
      const parsedMenu = typeof menu === "string" ? JSON.parse(menu) : menu;

      menuWithImages = parsedMenu.map((item, i) => ({
        ...item,
        image: menuImages[i]?.filename || null,
      }));
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      description,
      image: restaurantImage,
      menu: menuWithImages,
      owner: req.user.id,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({ message: "Failed to create restaurant" });
  }
};

/* GET all restaurants */
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name email");
    res.json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({ message: "Failed to get restaurants" });
  }
};