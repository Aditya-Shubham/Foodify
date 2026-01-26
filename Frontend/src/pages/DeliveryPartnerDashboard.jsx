import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/delivery/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  const formatAddress = (address) => {
    if (!address) return "Address not available";

    return `${address.street}, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">My Delivery Orders</h2>

      {orders.length === 0 && (
        <p className="no-orders">No orders assigned</p>
      )}

      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <p>
            <span className="label">Restaurant: </span>
            <span className="value">{order.restaurant?.name}</span>
          </p>

          <p>
            <span className="label">Customer: </span>
            <span className="value">{order.user?.name}</span>
          </p>

          <p>
            <span className="label">Phone: </span>
            <span className="value">{order.customerPhone}</span>
          </p>


          <p>
            <span className="label">Delivery Address: </span>
            <span className="value">{formatAddress(order.deliveryAddress)}</span>
          </p>

          <p>
            <span className="label">Status: </span>
            <span className="value">{order.status}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;


