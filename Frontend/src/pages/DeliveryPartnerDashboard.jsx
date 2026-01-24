import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryPartnerDashboard = () => {
  const token = localStorage.getItem("token");
  const [partner, setPartner] = useState(null);
  const [orders, setOrders] = useState([]); // 🔹 track assigned orders
  const [loading, setLoading] = useState(true);

  // Fetch partner info
  const fetchPartner = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPartner(res.data);
    } catch (err) {
      console.error("Fetch partner failed", err);
      setPartner(null);
    }
  };

  // Fetch assigned orders
  const fetchAssignedOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/delivery/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned orders", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPartner();
      await fetchAssignedOrders();
      setLoading(false);
    };
    fetchData();

    // 🔹 optional: poll every 10s for new assigned orders
    const interval = setInterval(fetchAssignedOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="dp-loading">Loading...</div>;
  }

  if (!partner) {
    return (
      <div className="dp-root">
        <div className="dp-center-box">
          <h2>No delivery profile found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-root">
      {orders.length === 0 ? (
        <div className="dp-center-box">
          <h2 className="dp-title">No order assigned</h2>
          <p className="dp-subtitle">
            You’ll be notified when an order is assigned
          </p>
          <span className="dp-badge dp-free">FREE</span>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="dp-card">
            <h3>Active Delivery</h3>
            <p><b>Order:</b> #{order._id.slice(-6)}</p>
            <p><b>Restaurant:</b> {order.restaurant?.name}</p>
            <p><b>Customer:</b> {order.user?.name}</p>
            <p><b>Address:</b> {order.deliveryAddress || "N/A"}</p>
            <p><b>Status:</b> {order.status}</p>
            <span className="dp-badge dp-assigned">ASSIGNED</span>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryPartnerDashboard;




