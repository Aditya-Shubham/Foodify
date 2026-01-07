
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Signup data:", formData);

    // TEMP UI-ONLY REDIRECT LOGIC
    if (formData.role === "admin") {
      navigate("/admin");
    } else if (formData.role === "owner") {
      navigate("/ResturantOwnerSetup"); // later: /owner/setup
    } else if (formData.role === "delivery") {
      navigate("/DeliveryPartnerSetup"); // later: /delivery/setup
    } else {
      navigate("/home"); 
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
