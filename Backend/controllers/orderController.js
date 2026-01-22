import Order from "../models/Order.js";

/* USER → PLACE ORDER */
export const placeOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount, paymentMethod } = req.body;

    // VALIDATION
    if (!restaurant) return res.status(400).json({ message: "Restaurant ID is required" });
    if (!items || items.length === 0) return res.status(400).json({ message: "Order items required" });
    if (!totalAmount) return res.status(400).json({ message: "Total amount required" });

    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items,
      totalAmount,
      paymentMethod,
      status: "PLACED",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Order failed", error: error.message });
  }
};

/* OWNER → GET ALL ORDERS */
export const getOwnerOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name") // optional: show restaurant name
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get owner orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
