import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantOwnerDashboard = () => {
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/orders/owner",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading orders...</p>;

  // ✅ MARK ORDER AS READY
  const markOrderReady = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/ready`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "READY" } : o
        )
      );
    } catch (err) {
      console.error("Failed to mark order as ready:", err);
    }
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
  <h2 className="dashboard-title">Restaurant Owner Dashboard</h2>

  <button className="back-btn1" onClick={handleLogout}>
    Logout
  </button>
</div>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <p>
                <strong>Customer:</strong> {order.user?.name}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <div className="items-section">
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="order-time">
                Ordered at: {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* ✅ ACCEPT & PREPARE BUTTON */}
              {order.status === "PLACED" && (
                <button
                  className="btn-accept-prepare"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      await axios.patch(
                        `http://localhost:5000/api/orders/${order._id}/accept`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      setOrders((prev) =>
                        prev.map((o) =>
                          o._id === order._id
                            ? { ...o, status: "PREPARING" }
                            : o
                        )
                      );
                    } catch (err) {
                      console.error("Accept order failed:", err);
                    }
                  }}
                >
                  Accept & Prepare
                </button>
              )}

              {/* ✅ READY FOR DELIVERY BUTTON */}
              {order.status === "PREPARING" && (
                <button
                  className="btn-ready-delivery"
                  onClick={() => markOrderReady(order._id)}
                >
                  Ready for Delivery
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOwnerDashboard;
