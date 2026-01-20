import React, { useEffect, useRef, useState } from "react";
import axios from "axios";


const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const hasFetched = useRef(false); // 🔑 prevents double fetch
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (hasFetched.current) return; // 🚫 stop second run
    hasFetched.current = true;

    const token = localStorage.getItem("token");

const fetchReadyOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/orders/ready",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReadyOrders();
  }, []); // ✅ empty dependency


  const assignDelivery = async (orderId) => {
    await axios.put(
      `http://localhost:5000/api/orders/${orderId}/assign`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // refresh once
    const res = await axios.get(
      "http://localhost:5000/api/orders/ready",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setOrders(res.data);
  };

  return (
    <div className="admin-dashboard">
      <h2>🛠 Admin Dashboard</h2>

      {orders.length === 0 && <p>No ready orders</p>}

      {orders.map((order) => (
        <div className="admin-order-card" key={order._id}>
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Status:</b> {order.status}</p>

          <button onClick={() => assignDelivery(order._id)}>
            Assign Delivery Partner
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;