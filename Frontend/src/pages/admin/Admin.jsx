   
import React, { useEffect, useState } from "react";

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

  const [activeSection, setActiveSection] = useState("dashboard");
  const [pendingRestaurants, setPendingRestaurants] = useState([]);

    // ✅ Add handleApprove here
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/restaurants/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // remove approved restaurant from pending list
        setPendingRestaurants(prev => prev.filter(r => r._id !== id));
      } else {
        alert(data.message || "Failed to approve");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  useEffect(() => {
    if (activeSection === "dashboard") {
      fetch("http://localhost:5000/api/restaurants/pending", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setPendingRestaurants(data))
        .catch(err => console.error(err));
    }
  }, [activeSection, token]);

  return (
    <div className="admin-container">
      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>

        <nav>
          <ul>
            <li
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </li>

            <li
              className={activeSection === "orders" ? "active" : ""}
              onClick={() => setActiveSection("orders")}
            >
              Orders
            </li>

            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-main">
        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="dashboard">
            <h3>Pending Restaurant Applications</h3>

            {pendingRestaurants.length === 0 ? (
              <p>No pending applications 🎉</p>
            ) : (
              <div className="pending-grid">
                {pendingRestaurants.map(r => (
                  <div key={r._id} className="pending-card">
                    <h4>{r.name}</h4>
                    <p><strong>Owner:</strong> {r.owner.name}</p>
                    <p><strong>Email:</strong> {r.owner.email}</p>
                    <p><strong>Address:</strong> {r.address}</p>

                    <div className="status pending">
                      ⏳ Pending Approval
                    </div>

                     <button
                      onClick={() => handleApprove(r._id)}
                      className="btn-approve"
                         >
                       Approve ✅
                      </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeSection === "orders" && (
          <div className="orders">
            <h3>Orders</h3>
            <p>Orders will appear here once connected to database.</p>
          </div>
        )}

        {/* SETTINGS */}
        {activeSection === "settings" && (
          <div className="settings">
            <h3>Settings</h3>
            <p>Manage preferences and configurations.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

