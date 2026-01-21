 import React, { useEffect, useState } from "react";

const Admin = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // 🚫 Role protection
  if (role !== "admin") {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied 🚫</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  const [activeSection, setActiveSection] = useState("restaurants");

  // States for pending items
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingDeliveryPartners, setPendingDeliveryPartners] = useState([]);

  /* =========================
     FETCH BOTH PENDING DATA ON MOUNT
  ========================= */
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

        const restaurantsData = await restaurantsRes.json();
        const deliveryData = await deliveryRes.json();

        setPendingRestaurants(restaurantsData);
        setPendingDeliveryPartners(deliveryData);
      } catch (err) {
        console.error("Failed to fetch pending data:", err);
      }
    };

    fetchPendingData();
  }, [token]);

  /* =========================
     APPROVE RESTAURANT
  ========================= */
  const approveRestaurant = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/restaurants/approve/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setPendingRestaurants((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     APPROVE DELIVERY PARTNER
  ========================= */
  const approveDeliveryPartner = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delivery/approve/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setPendingDeliveryPartners((prev) =>
          prev.filter((p) => p._id !== id)
        );
      }
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
              📦 Orders
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
                    <p>
                      <b>Owner:</b> {r.owner.name}
                    </p>
                    <p>
                      <b>Email:</b> {r.owner.email}
                    </p>
                    <p>
                      <b>Address:</b> {r.address}
                    </p>

                    <div className="status pending">⏳ Pending Approval</div>

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
                    <p>
                      <b>Email:</b> {p.user.email}
                    </p>
                    <p>
                      <b>Phone:</b> {p.phone}
                    </p>
                    <p>
                      <b>Address:</b> {p.address}
                    </p>

                    <div className="status pending">⏳ Pending Approval</div>

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

        {/* ===== ORDERS ===== */}
        {activeSection === "orders" && (
          <div className="dashboard">
            <h3>Orders</h3>
            <p>Orders management will be added later.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
