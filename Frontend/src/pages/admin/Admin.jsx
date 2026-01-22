import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // 🚫 Role protection: Only admin can access this page
  if (role !== "admin") {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied 🚫</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // 🟢 State to track which section/tab is active
  const [activeSection, setActiveSection] = useState("restaurants");

  // Pending applications
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingDeliveryPartners, setPendingDeliveryPartners] = useState([]);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* ==========================================================
     FETCH PENDING RESTAURANT & DELIVERY PARTNER APPLICATIONS
  ============================================================= */
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

  /* ========================================
     FETCH ORDERS BASED ON ACTIVE TAB
     - Preparing Orders → status = PREPARING
     - Ready Orders → status = READY
  ============================================ */
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

  /* =====================================
     APPROVE RESTAURANT APPLICATION
  ======================================= */
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

  /* ======================================
     APPROVE DELIVERY PARTNER APPLICATION
  ========================================== */
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

  
  return (
    <div className="admin-container">
      {/* ========== SIDEBAR ========== */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            {/* Restaurants tab */}
            <li
              className={activeSection === "restaurants" ? "active" : ""}
              onClick={() => setActiveSection("restaurants")}
            >
              🍽 Restaurants
            </li>

            {/* Delivery Partners tab */}
            <li
              className={activeSection === "delivery" ? "active" : ""}
              onClick={() => setActiveSection("delivery")}
            >
              🚚 Delivery Partners
            </li>

            {/* Preparing Orders tab */}
            <li
              className={activeSection === "orders" ? "active" : ""}
              onClick={() => setActiveSection("orders")}
            >
              ⏳ Preparing Orders
            </li>

            {/* Ready Orders tab */}
            <li
              className={activeSection === "readyOrders" ? "active" : ""}
              onClick={() => setActiveSection("readyOrders")}
            >
              🚀 Ready Orders
            </li>
          </ul>
        </nav>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="admin-main">
        {/* ===== RESTAURANTS ===== */}
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

                    {/* Approve restaurant button */}
                    <button
                      className="btn-approve"
                      onClick={() => approveRestaurant(r._id)}
                    >
                      Approve ✅
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== DELIVERY PARTNERS ===== */}
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

                    {/* Approve delivery partner button */}
                    <button
                      className="btn-approve"
                      onClick={() => approveDeliveryPartner(p._id)}
                    >
                      Approve ✅
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== ORDERS (PREPARING OR READY) ===== */}
        {(activeSection === "orders" || activeSection === "readyOrders") && (
          <div className="dashboard">
            <h3>
              {activeSection === "orders" ? "Preparing Orders" : "Ready Orders"}
            </h3>

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
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>

                    <p><b>Customer:</b> {order.user?.name}</p>
                    <p><b>Restaurant:</b> {order.restaurant?.name}</p>
                    <p><b>Total:</b> ₹{order.totalAmount}</p>
                    <p><b>Payment:</b> {order.paymentMethod}</p>
                    <p className="order-time">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    {/* Later: add Assign Delivery Partner button here */}
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

