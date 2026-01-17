import DeliveryPartner from "../models/DeliveryPartner.js";

/* REGISTER DELIVERY PARTNER */
export const registerDeliveryPartner = async (req, res) => {
  try {
    const existing = await DeliveryPartner.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const partner = await DeliveryPartner.create({
      user: req.user.id,
      phone: req.body.phone,
      address: req.body.address
    });

    res.status(201).json({
      message: "Delivery partner registered",
      partner
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register" });
  }
};

/* GET MY DELIVERY PARTNER (NEW) */
export const getMyDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user.id });

    if (!partner) {
      return res.status(404).json({ message: "Not registered" });
    }

    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

