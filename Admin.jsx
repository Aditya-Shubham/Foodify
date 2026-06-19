



import React, { useState } from "react";


const Admin = () => {
  const isAdmin = localStorage.getItem("isAdmin");

  // ❌ Access control
  if (isAdmin !== "true") {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied 🚫</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // ✅ Admin panel
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="admin-container">
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

      <main className="admin-main">
        {activeSection === "dashboard" && (
          <div className="dashboard">
            <h3>Welcome Admin 👋</h3>
            <p>Manage restaurants, users, and platform activity from one place.</p>

          </div>
        )}

        

        {activeSection === "orders" && (
          <div className="orders">
            <h3>Orders</h3>
           
            <p>Orders will appear here once connected to database.</p>
          </div>
        )}

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


