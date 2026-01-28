import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");


  // Move fetchOrders here so it can be reused
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/delivery/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };


  useEffect(() => {
    
    fetchOrders();
  }, []);

  const formatAddress = (address) => {
    if (!address) return "Address not available";

    return `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  return (
    <div className="deliverypartner-dashboard">
      <h2 className="dashboard-title">My Delivery Orders</h2>

      {orders.length === 0 && (
        <p className="no-orders">No orders assigned</p>
      )}

      {orders.map((order) => (
        <div key={order._id} className="dashboard order-card">
          <p>
            <span className="label">Restaurant: </span>
            <span className="value">{order.restaurant?.name}</span>
          </p>

          <p>
            <span className="label">Restaurant Address: </span>
            <span className="value">{order.restaurant?.address || "Address not available"}
            </span>
          </p>

          <p>
            <span className="label">Customer: </span>
            <span className="value">{order.user?.name}</span>
          </p>

          <p>
            <span className="label">Phone number: </span>
            <span className="value">{order.customerPhone || "N/A"}</span>
          </p>


          <p>
            <span className="label">Delivery Address: </span>
            <span className="value">{formatAddress(order.deliveryAddress)}</span>
          </p>

          <p>
            <span className="label">payment method: </span>
            <span className="value">{order.paymentMethod || "N/A"}</span>
          </p>

          <p>
            <span className="label">Total Amount: </span>
            <span className="value">₹{order.totalAmount}</span>
          </p>

          <p>
            <span className="label">Total Items: </span>
            <span className="value">{order.items?.length || 0}</span>
          </p>

          <p>
            <span className="label">Order Items: </span>
            <span className="value">
              {order.items
                ?.map((item) => `${item.name} x${item.quantity}`)
                .join(", ") || "N/A"}
            </span>
          </p>


          <p>
            <span className="label">Status: </span>
            <span className="value">{order.status}</span>
          </p>

    {/* ✅ Delivered Button */}
{order.status === "OUT_FOR_DELIVERY" && (
  <button
    onClick={async () => {
      try {
        const token = localStorage.getItem("token"); // Auth token
        const res = await fetch(`http://localhost:5000/api/orders/${order._id}/delivered`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // Safe JSON parse
        let data = {};
        try {
          data = await res.json();
        } catch (err) {
          console.warn("No JSON returned", err);
        }

        if (res.ok) {
          alert(data.message || "Order marked as delivered!");
          fetchOrders(); // Refresh orders
        } else {
          alert(data.message || "Failed to mark delivered");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    }}
    className="order-delivered-btn"
    
  >
    Delivered
  </button>
)}


        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;


