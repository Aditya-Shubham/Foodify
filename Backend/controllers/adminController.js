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
      return res.status(404).json({ message: "Partner not found" });
    }

    partner.status = "approved";
    await partner.save();

    res.json({ message: "Delivery partner approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};