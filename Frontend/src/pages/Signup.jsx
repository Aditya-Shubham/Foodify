
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
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
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      // ❌ Backend error (duplicate email, validation, etc.)
      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      // ✅ Success
      alert(data.message);

      // Redirect based on role
      if (formData.role === "admin") navigate("/admin");
      else if (formData.role === "owner") navigate("/ResturantOwnerSetup");
      else if (formData.role === "delivery") navigate("/DeliveryPartnerSetup");
      else navigate("/home");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>🍔 Foodify</h2>
        <p>Create your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          {/* ROLE SELECTOR */}
          <div className="role-selector">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="owner">Restaurant Owner</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>

        <span className="signup-footer">
          Already have an account? <b>Login</b>
        </span>
      </div>
    </div>
  );
};

export default Signup;
