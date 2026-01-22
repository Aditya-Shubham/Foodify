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


/* OWNER → ACCEPT / PREPARE ORDER */
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "PREPARING";
    await order.save();

    res.json({ message: "Order accepted & preparing", order });
  } catch (error) {
    console.error("Accept order error:", error);
    res.status(500).json({ message: "Failed to accept order" });
  }
};

/* ADMIN → GET PREPARING ORDERS */
export const getPreparingOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ status: "PREPARING" })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
