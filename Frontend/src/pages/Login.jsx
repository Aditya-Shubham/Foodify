import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user" // default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);

      // ✅ ROLE-BASED REDIRECT
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "owner") {
        navigate("/ResturantOwnerSetup");
      } else if (data.role === "delivery") {
        navigate("/delivery");
      } else {
        navigate("/home");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>🍔 Foodify</h2>
        <p>Login to your account</p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
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

          {/* PASSWORD */}
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

          {/* ROLE SELECT */}
          <div className="role-selector">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="owner">Restaurant Owner</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          {/* LOGIN BUTTON */}
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