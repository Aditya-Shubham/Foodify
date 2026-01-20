import React, { useEffect, useState } from "react";
import { getAvailableOrders, acceptOrder, updateOrderStatus } from "../api/deliveryApi";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders on load
  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAvailableOrders();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      setLoading(false);
    }
  };

  // Accept an order
  const handleAccept = async (orderId) => {
    try {
      await acceptOrder(orderId);
      alert("Order accepted!");
      loadOrders(); // refresh list
    } catch (err) {
      alert(err.message || "Failed to accept order");
    }
  };

  // Update order status
  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      alert(`Order marked as ${status}`);
      loadOrders(); // refresh list
    } catch (err) {
      alert(err.message || "Failed to update order status");
    }
  };

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAvailableOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders(); // call the async function
}, []); // empty dependency array ensures this runs once

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard">
      <h2>Delivery Partner Dashboard 🚚</h2>

      {orders.length === 0 ? (
        <p>No orders assigned yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name || "N/A"}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === "pending" && (
                    <button onClick={() => handleAccept(order._id)}>Accept</button>
                  )}
                  {order.status === "accepted" && (
                    <>
                      <button onClick={() => handleUpdateStatus(order._id, "picked")}>
                        Picked
                      </button>
                      <button onClick={() => handleUpdateStatus(order._id, "delivered")}>
                        Delivered
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveryDashboard;