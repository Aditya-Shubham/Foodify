import mongoose from "mongoose";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

/* =========================
   USER places order
========================= */
export const placeOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurant))
      return res.status(400).json({ message: "Invalid restaurant ID" });

    const existingRestaurant = await Restaurant.findById(restaurant);
    if (!existingRestaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items,
      totalAmount,
      status: "PLACED",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order failed" });
  }
};

/* =========================
   RESTAURANT: Get its orders
========================= */
export const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.id })
      .populate("user", "name")
      .populate("restaurant", "name");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch restaurant orders" });
  }
};

/* =========================
   RESTAURANT: Mark order READY
========================= */
export const markOrderReady = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "READY";
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark order ready" });
  }
};

/* =========================
   ADMIN: Get READY orders
========================= */
export const getReadyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "READY" })
      .populate("restaurant", "name address")
      .populate("user", "name");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ready orders" });
  }
};

/* =========================
   ADMIN: Assign delivery partner
========================= */
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryPartner = deliveryPartnerId;
    order.status = "OUT_FOR_DELIVERY";

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to assign delivery partner" });
  }
};

/* =========================
   DELIVERY: Get available orders
========================= */
export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "PLACED",
      deliveryPartner: null,
    })
      .populate("user", "name")
      .populate("restaurant", "name address");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* =========================
   DELIVERY: Accept order
========================= */
export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryPartner = req.user.id;
    order.status = "ACCEPTED";

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to accept order" });
  }
};

/* =========================
   DELIVERY: Update order status
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid order ID" });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};