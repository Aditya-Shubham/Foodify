import Restaurant from "../models/Restaurant.js";
import DeliveryPartner from "../models/DeliveryPartner.js";


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

/* ===============================
   ADMIN: approve delivery partner
================================ */
export const approveDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    partner.isApproved = true; 
    await partner.save();

    res.json({ message: "Delivery partner approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

/* ===============================
   ADMIN: Get Pending Delivery Partners
================================ */
export const getPendingDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({isApproved: false  })
      .populate("user", "name email");

    res.status(200).json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending delivery partners" });
  }
};
