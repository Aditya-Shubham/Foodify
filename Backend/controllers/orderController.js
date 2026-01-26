import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import DeliveryPartner from "../models/DeliveryPartner.js";

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
    const restaurants = await Restaurant.find({ owner: req.user.id }).select("_id");

    if (!restaurants.length) return res.json([]);

    const restaurantIds = restaurants.map(r => r._id);

    const orders = await Order.find({
      restaurant: { $in: restaurantIds },
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
   OWNER → ACCEPT ORDER
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

    if (req.io) {
      req.io.emit("order_ready", {
        orderId: order._id,
        restaurant: order.restaurant,
      });
    }

    res.json({ success: true, message: "Order marked as ready", order });
  } catch (error) {
    console.error("markOrderReady error:", error);
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
    console.error("Admin preparing orders error:", error);
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
    console.error("Admin ready orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ===============================
   DELIVERY → GET MY ORDERS
   (ADDRESS + PHONE FIXED ✅)
================================ */
export const getDeliveryPartnerOrders = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user.id });
    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    const orders = await Order.find({ deliveryPartner: partner._id })
      .populate("restaurant", "name")
      .populate("user", "name email phone addresses"); // ✅ phone added

    const formattedOrders = orders.map(order => {
      const user = order.user?.toObject();

      return {
        ...order.toObject(),
        customerPhone: user?.phone || null, // ✅ phone exposed
        deliveryAddress:
          user?.addresses?.find(a => a.isDefault) ||
          user?.addresses?.[0] ||
          null,
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error("Delivery partner orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


/* ===============================
   DELIVERY → MARK DELIVERED
================================ */
export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const partner = await DeliveryPartner.findOne({ user: req.user.id });

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
    console.error("markDelivered error:", error);
    res.status(500).json({ message: "Failed to mark delivered" });
  }
};
