import DeliveryPartner from "../models/DeliveryPartner.js";

/* CREATE DELIVERY PARTNER */
export const registerDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.create({
      user: req.user.id, // from JWT
      phone: req.body.phone,
      address: req.body.address,
      aadhaar: req.body.aadhaar || "",
      drivingLicense: req.body.drivingLicense || ""
    });

    res.status(201).json({
      message: "Delivery partner registered successfully",
      partner
    });
  } catch (error) {
    console.error("Delivery partner error:", error);
    res.status(500).json({
      message: "Failed to register delivery partner"
    });
  }
};
