import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

/* ===============================
   USER → PLACE ORDER
================================ */
export const placeOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount, paymentMethod } = req.body;

    if (!restaurant)
      return res.status(400).json({ message: "Restaurant ID is required" });
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order items required" });
    if (!totalAmount)
      return res.status(400).json({ message: "Total amount required" });

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

/* ===============================
   OWNER → GET ALL ORDERS
================================ */
export const getOwnerOrders = async (req, res) => {
  try {
    // 1️⃣ Find restaurants owned by this user
    const restaurants = await Restaurant.find({ owner: req.user.id }).select("_id");

    if (!restaurants.length) {
      return res.json([]); // owner has no restaurants
    }

    // 2️⃣ Extract restaurant IDs
    const restaurantIds = restaurants.map(r => r._id);

    // 3️⃣ Fetch orders ONLY for these restaurants
    const orders = await Order.find({
      restaurant: { $in: restaurantIds }
    })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get owner orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ===============================
   OWNER → ACCEPT / PREPARE ORDER
================================ */
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "PREPARING";
    await order.save();

    res.json({ message: "Order accepted & preparing", order });
  } catch (error) {
    console.error("Accept order error:", error);
    res.status(500).json({ message: "Failed to accept order" });
  }
};

/* ===============================
   OWNER → MARK ORDER AS READY
================================ */
export const markOrderReady = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "READY";
    await order.save();

    // Optional: notify admin via Socket.io
    if (req.io) {
      req.io.emit("order_ready", {
        orderId: order._id,
        restaurant: order.restaurant,
      });
    }

    res.json({ success: true, message: "Order marked as ready", order });
  } catch (err) {
    console.error("markOrderReady error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN → GET PREPARING ORDERS
================================ */
export const getPreparingOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ status: "PREPARING" })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin preparing orders fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ===============================
   ADMIN → GET READY ORDERS
================================ */
export const getReadyOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ status: "READY" })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin ready orders fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/*==========================
      order deliverd
========================*/
export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const partner = await DeliveryPartner.findOne({
      user: req.user.id
    });

    if (!order || !partner) {
      return res.status(404).json({ message: "Not found" });
    }

    order.status = "DELIVERED";
    partner.status = "FREE";
    partner.currentOrder = null;

    await order.save();
    await partner.save();

    res.json({ message: "Order delivered" });
  } catch (error) {
    res.status(500).json({ message: "Failed" });
  }
};
