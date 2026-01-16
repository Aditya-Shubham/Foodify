import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const DeliveryPartnerSetup = () => {
  const navigate = useNavigate();

  const [partner, setPartner] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    aadhaar: null,
    drivingLicense: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "aadhaar" || name === "drivingLicense") {
      setPartner({ ...partner, [name]: files[0] });
    } else {
      setPartner({ ...partner, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch("http://localhost:5000/api/delivery-partners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        phone: partner.phone,
        address: partner.address
        // images later (multer)
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Delivery partner registered successfully 🚚");
    navigate("/home");// later: /delivery/dashboard

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="profile-page">
      <div className="profile-section">
        <h2>Register as Delivery Partner 🚚</h2>
        <p>Fill in your details to join Foodify as a delivery partner.</p>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={partner.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={partner.email}
              onChange={handleChange}
              required
              placeholder="Email address"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={partner.phone}
              onChange={handleChange}
              required
              placeholder="10-digit phone number"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={partner.address}
              onChange={handleChange}
              required
              placeholder="Your current address"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={partner.password}
              onChange={handleChange}
              required
              placeholder="Set a password"
            />
          </div>

          <div className="form-group">
            <label>Aadhaar Card</label>
            <input
              type="file"
              name="aadhaar"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Driving License</label>
            <input
              type="file"
              name="drivingLicense"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-save">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryPartnerSetup;
