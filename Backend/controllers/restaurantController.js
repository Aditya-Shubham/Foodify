
import Restaurant from "../models/Restaurant.js";

/* ===============================
   OWNER: Create Restaurant
================================ */
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
      menu,
      approved: false // admin approval
    });

    res.status(201).json({
      success: true,
      message: "Restaurant registered, pending admin approval",
      restaurant
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create restaurant"
    });
  }
};

/* ===============================
   USER: Get Approved Restaurants
================================ */
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: true });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurants"
    });
  }
};

/* ===============================
   ADMIN: Get Pending Restaurants
================================ */
export const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: false })
      .populate("owner", "name email");

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending restaurants"
    });
  }
};
/* ===============================
   ADMIN: Approve Restaurant
================================ */
export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.approved = true;
    await restaurant.save();

    res.status(200).json({ message: "Restaurant approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve restaurant" });
  }
};
/*=====================================
 GET restaurant of logged-in owner
 ====================================== */
/*export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      return res.json({ exists: false });
    }

    res.json({
      exists: true,
      approved: restaurant.approved,
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
*/
export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });

    if (!restaurant) {
      // No restaurant exists → send 404
      return res.status(404).json({ message: "No restaurant found" });
    }

    // Restaurant exists
    res.status(200).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

