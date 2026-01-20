import React, { useEffect, useState } from "react";
import axios from "axios";

const RestaurantDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/restaurant",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h3>Loading orders...</h3>;

  return (
    <div className="restaurant-dashboard">
      <h2>🍽 Restaurant Owner Dashboard</h2>

      {orders.length === 0 ? (
        <p className="empty">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span>Order #{order._id.slice(-5)}</span>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <p className="total">Total: ₹{order.totalAmount}</p>

            <div className="actions">
              {order.status === "PLACED" && (
                <button
                  className="accept"
                  onClick={() => updateStatus(order._id, "accept")}
                >
                  Accept
                </button>
              )}

              {order.status === "ACCEPTED" && (
                <button
                  className="ready"
                  onClick={() => updateStatus(order._id, "ready")}
                >
                  Mark Ready
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RestaurantDashboard;