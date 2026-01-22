import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ SAVE AUTH DATA
      const token = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("role", data.role);

      /* ===== ROLE BASED REDIRECT ===== */

      // ADMIN
      if (data.role === "admin") {
        navigate("/admin");
      }

      // RESTAURANT OWNER
      else if (data.role === "owner") {
        const resRestaurant = await fetch(
          "http://localhost:5000/api/restaurants/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resRestaurant.status === 404) {
          navigate("/ResturantOwnerSetup");
        } else if (!resRestaurant.ok) {
          alert("Failed to check restaurant status");
        } else {
          const restaurant = await resRestaurant.json();
          if (!restaurant.approved) {
            navigate("/RestaurantPending");
          } else {
            navigate("/RestaurantOwnerDashboard");
          }
        }
      }

      // DELIVERY PARTNER
      else if (data.role === "delivery") {
        const resPartner = await fetch(
          "http://localhost:5000/api/delivery-partners/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (resPartner.status === 404) {
          navigate("/DeliveryPartnerSetup");
        } else if (!resPartner.ok) {
          alert("Failed to check delivery partner status");
        } else {
          const partner = await resPartner.json();
          if (!partner.isApproved) {
            navigate("/DeliveryPartnerPending");
          } else {
            navigate("/DeliveryPartnerDashboard");
          }
        }
      }

      // OTHER USERS / DEFAULT
      else {
        navigate("/home");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>🍔 Foodify</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="signup-btn">
            Login
          </button>
        </form>

        <span className="signup-footer">
          Don’t have an account?{" "}
          <b
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => navigate("/")}
          >
            Sign Up
          </b>
        </span>
      </div>
    </div>
  );
};

export default Login;
