import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (role !== "admin") {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied 🚫</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState("restaurants");
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingDeliveryPartners, setPendingDeliveryPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [freePartners, setFreePartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({}); // 🔹 added state

  // Fetch pending restaurants & partners
  useEffect(() => {
    const fetchPendingData = async () => {
      try {
        const [restaurantsRes, deliveryRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/restaurants/pending", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/admin/delivery/pending", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPendingRestaurants(await restaurantsRes.json());
        setPendingDeliveryPartners(await deliveryRes.json());
      } catch (err) {
        console.error("Failed to fetch pending data:", err);
      }
    };
    fetchPendingData();
  }, [token]);

  // Fetch orders for preparing or ready
  useEffect(() => {
    if (activeSection !== "orders" && activeSection !== "readyOrders") return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const endpoint =
          activeSection === "orders"
            ? "http://localhost:5000/api/orders/admin/preparing"
            : "http://localhost:5000/api/orders/admin/ready";

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [activeSection, token]);

  // Fetch free delivery partners (only for readyOrders)
  useEffect(() => {
    if (activeSection !== "readyOrders") return;

    const fetchFreePartners = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/admin/delivery/free",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFreePartners(res.data);
    };

    fetchFreePartners();
  }, [activeSection, token]);

  // Approve Restaurant
  const approveRestaurant = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/restaurants/approve/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Approve Delivery Partner
  const approveDeliveryPartner = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delivery/approve/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok)
        setPendingDeliveryPartners((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Assign Order
  const assignOrder = async (orderId) => {
    const partnerId = selectedPartner[orderId];
    if (!partnerId) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/assign-delivery",
        { orderId, partnerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setFreePartners((prev) => prev.filter((p) => p._id !== partnerId));
        setSelectedPartner((prev) => ({ ...prev, [orderId]: "" }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to assign order");
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li
              className={activeSection === "restaurants" ? "active" : ""}
              onClick={() => setActiveSection("restaurants")}
            >
              🍽 Restaurants
            </li>
            <li
              className={activeSection === "delivery" ? "active" : ""}
              onClick={() => setActiveSection("delivery")}
            >
              🚚 Delivery Partners
            </li>
            <li
              className={activeSection === "orders" ? "active" : ""}
              onClick={() => setActiveSection("orders")}
            >
              ⏳ Preparing Orders
            </li>
            <li
              className={activeSection === "readyOrders" ? "active" : ""}
              onClick={() => setActiveSection("readyOrders")}
            >
              🚀 Ready Orders
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        {/* Restaurants */}
        {activeSection === "restaurants" && (
          <div className="dashboard">
            <h3>Pending Restaurant Applications</h3>
            {pendingRestaurants.length === 0 ? (
              <p>No pending applications 🎉</p>
            ) : (
              <div className="pending-grid">
                {pendingRestaurants.map((r) => (
                  <div key={r._id} className="pending-card">
                    <h4>{r.name}</h4>
                    <p><b>Owner:</b> {r.owner.name}</p>
                    <p><b>Email:</b> {r.owner.email}</p>
                    <p><b>Address:</b> {r.address}</p>
                    <div className="status pending">⏳ Pending Approval</div>
                    <button className="btn-approve" onClick={() => approveRestaurant(r._id)}>Approve ✅</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delivery Partners */}
        {activeSection === "delivery" && (
          <div className="dashboard">
            <h3>Pending Delivery Partner Applications</h3>
            {pendingDeliveryPartners.length === 0 ? (
              <p>No pending applications 🎉</p>
            ) : (
              <div className="pending-grid">
                {pendingDeliveryPartners.map((p) => (
                  <div key={p._id} className="pending-card">
                    <h4>{p.user.name}</h4>
                    <p><b>Email:</b> {p.user.email}</p>
                    <p><b>Phone:</b> {p.phone}</p>
                    <p><b>Address:</b> {p.address}</p>
                    <div className="status pending">⏳ Pending Approval</div>
                    <button className="btn-approve" onClick={() => approveDeliveryPartner(p._id)}>Approve ✅</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {(activeSection === "orders" || activeSection === "readyOrders") && (
          <div className="dashboard">
            <h3>{activeSection === "orders" ? "Preparing Orders" : "Ready Orders"}</h3>
            {ordersLoading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <span>Order #{order._id.slice(-6)}</span>
                      <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <p><b>Customer:</b> {order.user?.name}</p>
                    <p><b>Restaurant:</b> {order.restaurant?.name}</p>
                    <p><b>Total:</b> ₹{order.totalAmount}</p>
                    <p><b>Payment:</b> {order.paymentMethod}</p>
                    <p className="order-time">{new Date(order.createdAt).toLocaleString()}</p>

                    {/* Assign Delivery Partner */}
                    {activeSection === "readyOrders" && (
                      <>
                        <select
                          value={selectedPartner[order._id] || ""}
                          onChange={(e) =>
                            setSelectedPartner((prev) => ({
                              ...prev,
                              [order._id]: e.target.value
                            }))
                          }
                        >
                          <option value="" disabled>
                            Assign Delivery Partner
                          </option>
                          {freePartners.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.user?.name} (FREE)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignOrder(order._id)}
                          disabled={!selectedPartner[order._id]}
                        >
                        <div className="delivery-assign-btn">
                          Assign
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
