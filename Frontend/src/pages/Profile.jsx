import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// OrderHistory Component
const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/orders/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading order history...</p>;
  if (!orders.length) return <p className="no-orders">No orders yet 😶</p>;

  return (
    <section className="order-history-section">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span className="order-id">Order #{order._id.slice(-6)}</span>
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <p><strong>Restaurant:</strong> {order.restaurant?.name}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>

            {order.deliveryAddress && (
              <p>
                <strong>Address:</strong> {order.deliveryAddress.street}
                {order.deliveryAddress.apartment && `, ${order.deliveryAddress.apartment}`}, 
                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
            )}

            <div className="items-section">
              <strong>Items:</strong>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} - ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="order-time">
              Ordered at: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main Profile Component
const Profile = () => {
  const navigate = useNavigate();

  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    photo: null
  });

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [currentAddress, setCurrentAddress] = useState({
    label: "Home",
    street: "",
    apartment: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone || ""
        });
        setAddresses(data.addresses || []);
      });
  }, []);

  // Profile change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Address change
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAddress({
      ...currentAddress,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Save or update address
  const handleSaveAddress = async () => {
    let updatedAddresses;

    if (editingAddressId) {
      updatedAddresses = addresses.map(a =>
        a._id === editingAddressId ? { ...currentAddress, _id: editingAddressId } : a
      );
    } else {
      updatedAddresses = [...addresses, currentAddress];
    }

    setAddresses(updatedAddresses);

    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/user/addresses", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ addresses: updatedAddresses })
    });

    setShowAddressForm(false);
    setEditingAddressId(null);
    setCurrentAddress({
      label: "Home",
      street: "",
      apartment: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false
    });
  };

  // Edit address
  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find(addr => addr._id === id);
    setCurrentAddress(addressToEdit);
    setEditingAddressId(id);
    setShowAddressForm(true);
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updatedAddresses = addresses.filter(addr => addr._id !== id);
      setAddresses(updatedAddresses);
      localStorage.setItem("deliveryAddresses", JSON.stringify(updatedAddresses));
    }
  };

  // Set default address
  const handleSetDefault = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr._id === id
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem("deliveryAddresses", JSON.stringify(updatedAddresses));
  };

  // Save profile
  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:5000/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });

    alert("Profile saved successfully!");
  };

  return (
    <div className="page profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn1" onClick={() => navigate("/home")}>
          ← Back
        </button>
        <h1>My Profile</h1>
      </div>

      {/* Profile Information Section */}
      <section className="profile-section">
        <h2>Personal Information</h2>
        <div className="profile-form">
          <div className="form-group">
            <label>Full Name </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone Number </label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <button className="btn-save" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      </section>

      {/* Delivery Addresses Section */}
      <section className="address-section">
        <div className="section-header">
          <h2>Delivery Addresses</h2>
          <button 
            className="btn-add-address"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            + Add New Address
          </button>
        </div>

        {/* Address Form */}
        {showAddressForm && (
          <div className="address-form">
            <h3>{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
            <div className="form-group">
              <label>Address Label </label>
              <select
                name="label"
                value={currentAddress.label}
                onChange={handleAddressChange}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Hostel">Hostel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Street Address </label>
              <input
                type="text"
                name="street"
                value={currentAddress.street}
                onChange={handleAddressChange}
                placeholder="House No., Street Name"
              />
            </div>

            <div className="form-group">
              <label>Apartment/Floor (Optional)</label>
              <input
                type="text"
                name="apartment"
                value={currentAddress.apartment}
                onChange={handleAddressChange}
                placeholder="Apartment, Suite, Floor"
              />
            </div>

            <div className="form-group">
              <label>Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={currentAddress.landmark}
                onChange={handleAddressChange}
                placeholder="Nearby landmark"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City </label>
                <input
                  type="text"
                  name="city"
                  value={currentAddress.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label>State </label>
                <input
                  type="text"
                  name="state"
                  value={currentAddress.state}
                  onChange={handleAddressChange}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-group">
              <label>PIN Code </label>
              <input
                type="text"
                name="pincode"
                value={currentAddress.pincode}
                onChange={handleAddressChange}
                placeholder="6-digit PIN code"
                maxLength="6"
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                name="isDefault"
                checked={currentAddress.isDefault}
                onChange={handleAddressChange}
                id="defaultAddress"
              />
              <label htmlFor="defaultAddress">Set as default address</label>
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleSaveAddress}>
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
              <button 
                className="btn-cancel" 
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                  setCurrentAddress({
                    label: "Home",
                    street: "",
                    apartment: "",
                    landmark: "",
                    city: "",
                    state: "",
                    pincode: "",
                    isDefault: false
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Saved Addresses List */}
        <div className="addresses-list">
          {addresses.length === 0 ? (
            <div className="empty-state">
              <p>📍 No saved addresses yet</p>
              <p className="subtext">Add your first delivery address to get started</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                <div className="address-header">
                  <span className="address-label">{address.label}</span>
                  {address.isDefault && <span className="default-badge">Default</span>}
                </div>
                
                <div className="address-details">
                  <p>{address.street}</p>
                  {address.apartment && <p>{address.apartment}</p>}
                  {address.landmark && <p>Near {address.landmark}</p>}
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                </div>

                <div className="address-actions">
                  {!address.isDefault && (
                    <button onClick={() => handleSetDefault(address._id)}>
                      Set as Default
                    </button>
                  )}
                  <button onClick={() => handleEditAddress(address._id)}>
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteAddress(address._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Order History Section */}
      <OrderHistory />
    </div>
  );
};

export default Profile;
