import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryPartnerDashboard = () => {
  const token = localStorage.getItem("token");

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPartner = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/my",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPartner(res.data);
    } catch (err) {
      console.error("Fetch partner failed", err);
      setPartner(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartner();
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
      {partner.status === "FREE" && (
        <div className="dp-center-box">
          <h2 className="dp-title">No order assigned</h2>
          <p className="dp-subtitle">
            You’ll be notified when an order is assigned
          </p>
          <span className="dp-badge dp-free">FREE</span>
        </div>
      )}

      {partner.status === "ASSIGNED" && partner.currentOrder && (
        <div className="dp-card">
          <h3>Active Delivery</h3>

          <p><b>Order:</b> #{partner.currentOrder._id.slice(-6)}</p>
          <p><b>Restaurant:</b> {partner.currentOrder.restaurant?.name}</p>
          <p><b>Customer:</b> {partner.currentOrder.user?.name}</p>
          <p><b>Address:</b> {partner.currentOrder.deliveryAddress}</p>

          <span className="dp-badge dp-assigned">ASSIGNED</span>
        </div>
      )}
    </div>
  );
};

export default DeliveryPartnerDashboard;




