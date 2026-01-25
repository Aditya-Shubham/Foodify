admin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const [activeSection, setActiveSection] = useState("restaurants");
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingDeliveryPartners, setPendingDeliveryPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [freePartners, setFreePartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({}); // 🔹 added state

  // Fetch pending restaurants & partners
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

  // Fetch orders for preparing or ready
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

  // Fetch free delivery partners (only for readyOrders)
  useEffect(() => {
    if (activeSection !== "readyOrders") return;

    const fetchFreePartners = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/admin/delivery/free",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFreePartners(res.data);
    };

    fetchFreePartners();
  }, [activeSection, token]);

  // Approve Restaurant
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

  // Approve Delivery Partner
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

  // 🔹 Assign Order
  const assignOrder = async (orderId) => {
    const partnerId = selectedPartner[orderId];
    if (!partnerId) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/assign-delivery",
        { orderId, partnerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setFreePartners((prev) => prev.filter((p) => p._id !== partnerId));
        setSelectedPartner((prev) => ({ ...prev, [orderId]: "" }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to assign order");
    }
  };

  return (
    <div className="admin-container">
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
              ⏳ Preparing Orders
            </li>
            <li
              className={activeSection === "readyOrders" ? "active" : ""}
              onClick={() => setActiveSection("readyOrders")}
            >
              🚀 Ready Orders
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        {/* Restaurants */}
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
                    <button className="btn-approve" onClick={() => approveRestaurant(r._id)}>Approve ✅</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delivery Partners */}
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
                    <button className="btn-approve" onClick={() => approveDeliveryPartner(p._id)}>Approve ✅</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {(activeSection === "orders" || activeSection === "readyOrders") && (
          <div className="dashboard">
            <h3>{activeSection === "orders" ? "Preparing Orders" : "Ready Orders"}</h3>
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
                      <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <p><b>Customer:</b> {order.user?.name}</p>
                    <p><b>Restaurant:</b> {order.restaurant?.name}</p>
                    <p><b>Total:</b> ₹{order.totalAmount}</p>
                    <p><b>Payment:</b> {order.paymentMethod}</p>
                    <p className="order-time">{new Date(order.createdAt).toLocaleString()}</p>

                    {/* Assign Delivery Partner */}
                    {activeSection === "readyOrders" && (
                      <>
                        <select
                          value={selectedPartner[order._id] || ""}
                          onChange={(e) =>
                            setSelectedPartner((prev) => ({
                              ...prev,
                              [order._id]: e.target.value
                            }))
                          }
                        >
                          <option value="" disabled>
                            Assign Delivery Partner
                          </option>
                          {freePartners.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.user?.name} (FREE)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => assignOrder(order._id)}
                          disabled={!selectedPartner[order._id]}
                        >
                        <div className="delivery-assign-btn">
                          Assign
                          </div>
                        </button>
                      </>
                    )}
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
cart.jsx
import axios from "axios";
import React from "react";

const Cart = ({ cart, removeFromCart, addToCart }) => {
  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [upiId, setUpiId] = React.useState("");
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [upiVerified, setUpiVerified] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  // TOTAL QTY & SUBTOTAL
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // FIRST ORDER CHECK
  const isFirstOrder = !localStorage.getItem("hasOrderedBefore");

  // DISCOUNT LOGIC
  let discount = 0;
  if (isFirstOrder) discount = Math.floor(subtotal * 0.4);
  else if (subtotal >= 800 && totalQty >= 8) discount = 250;
  else if (subtotal >= 500 && totalQty >= 5) discount = 150;
  else if (subtotal >= 300 && totalQty >= 3) discount = 100;
  else if (subtotal >= 200 && totalQty >= 2) discount = 50;

  const total = Math.max(subtotal - discount, 0);

  // PLACE ORDER
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("⚠️ Your cart is empty");
      return;
    }

    if (paymentMethod === "upi" && !upiVerified) {
      alert("⚠️ Verify UPI first");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // All items from same restaurant
      const restaurantId = cart[0]?.restaurantId;
      if (!restaurantId) {
        alert("⚠️ Restaurant ID missing for order");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          restaurant: restaurantId,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price
          })),
          totalAmount: total,
          paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order saved:", res.data);
      alert("🎉 Order placed!");
      setOrderPlaced(true);
      localStorage.setItem("hasOrderedBefore", "true");
    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      alert("❌ Order failed");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Your Cart</h2>
        <p>Add items to place an order</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">🛒 Your cart is empty</div>
      ) : (
        <div className="cart-card">
          <h3>Selected Items</h3>

          {isFirstOrder && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              🎉 First Order Offer: Flat 40% OFF
            </p>
          )}

          {cart.map((item, index) => (
            <div
              key={index}
              className="cart-item"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}
            >
              <div style={{ flex: 2 }}>
                <p>
                  <strong>{item.name}</strong>{" "}
                  <span className={`food-type ${item.type === "VEG" ? "veg" : "nonveg"}`}>
                    {item.type === "VEG" ? "🟢 Veg" : "🔴 Non-Veg"}
                  </span>
                </p>
              </div>

              <div style={{ flex: 1 }}>
                <div className="qty-control">
                  <button onClick={() => removeFromCart(item)}>-</button>
                  <span>{item.qty}</span>
                  {/* ✅ PASS restaurantId for + */}
                  <button onClick={() => addToCart(item, item.restaurantId)}>+</button>
                </div>
              </div>

              <div style={{ flex: 0 }}>
                <p>₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}

          <div className="payment-box">
            <h3>Payment Method</h3>
            <label className="payment-option">
              <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              Cash on Delivery
            </label>
            <label className="payment-option">
              <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
              UPI
            </label>

            {paymentMethod === "upi" && (
              <div className="upi-box">
                <input type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }} />
                <button disabled={upiId.trim() === "" || verifying} onClick={() => {
                  setVerifying(true);
                  setTimeout(() => { setUpiVerified(true); setVerifying(false); alert("✅ UPI ID verified"); }, 1000);
                }}>
                  {verifying ? "Verifying..." : upiVerified ? "Verified" : "Verify"}
                </button>
              </div>
            )}
          </div>

          <div className="cart-total">
            <p>Items: {totalQty}</p>
            <p>SubTotal: ₹{subtotal}</p>
            <p className="discount">Discount: - ₹{discount}</p>
            <h3>Total: ₹{total}</h3>

            <div className="place-order-wrapper">
              <button className="place-order-btn" onClick={placeOrder} disabled={orderPlaced || (paymentMethod === "upi" && !upiVerified)}>
                {orderPlaced ? "ORDER PLACED" : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryPartnerDashboard = () => {
  const token = localStorage.getItem("token");
  const [partner, setPartner] = useState(null);
  const [orders, setOrders] = useState([]); // 🔹 track assigned orders
  const [loading, setLoading] = useState(true);

  // Fetch partner info
  const fetchPartner = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/delivery-partners/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPartner(res.data);
    } catch (err) {
      console.error("Fetch partner failed", err);
      setPartner(null);
    }
  };

  // Fetch assigned orders
  const fetchAssignedOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/delivery/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch assigned orders", err);
      setOrders([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchPartner();
      await fetchAssignedOrders();
      setLoading(false);
    };
    fetchData();

    // 🔹 optional: poll every 10s for new assigned orders
    const interval = setInterval(fetchAssignedOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="dp-loading">Loading...</div>;
  }

  if (!partner) {
    return (
      <div className="dp-root">
        <div className="dp-center-box">
          <h2>No delivery profile found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-root">
      {orders.length === 0 ? (
        <div className="dp-center-box">
          <h2 className="dp-title">No order assigned</h2>
          <p className="dp-subtitle">
            You’ll be notified when an order is assigned
          </p>
          <span className="dp-badge dp-free">FREE</span>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="dp-card">
            <h3>Active Delivery</h3>
            <p><b>Order:</b> #{order._id.slice(-6)}</p>
            <p><b>Restaurant:</b> {order.restaurant?.name}</p>
            <p><b>Customer:</b> {order.user?.name}</p>
            <p><b>Address:</b> {order.deliveryAddress || "N/A"}</p>
            <p><b>Status:</b> {order.status}</p>
            <span className="dp-badge dp-assigned">ASSIGNED</span>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryPartnerDashboard;




 orders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "./TopBar";

const RestaurantCard = ({ restaurant, onSelect }) => (
  <div className="restaurant-card" onClick={() => onSelect(restaurant)}>
    {restaurant.image && <img src={`http://localhost:5000/uploads/restaurants/${restaurant.image}`} alt={restaurant.name} className="restaurant-img" />}
    <h3>{restaurant.name}</h3>
    <p>{restaurant.cuisine}</p>
  </div>
);

const FoodCard = ({ item, addToCart }) => (
  <div className="food-card">
    {item.image && <img src={`http://localhost:5000/uploads/menu/${item.image}`} alt={item.name} className="food-img" />}
    <div className="food-info">
      <h4>{item.name}</h4>
      <span className={`food-type ${item.type === "VEG" ? "veg" : "nonveg"}`}>
        {item.type === "VEG" ? "🟢 Veg" : "🔴 Non-Veg"}
      </span>
      <div className="food-bottom"><span>₹{item.price}</span></div>
      <button className="add-btn" onClick={() => addToCart(item, item.restaurantId)}>ADD</button>
    </div>
  </div>
);

const Menu = ({ addToCart }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data);
      } catch (err) { console.error(err); }
    };
    fetchRestaurants();
  }, []);

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <>
      <TopBar />
      <div className="page">
        {!selectedRestaurant ? (
          <>
            <div className="page-header">
              <h2>Select a Restaurant</h2>
              <p>Choose from top-rated restaurants near you</p>
            </div>
            <div className="restaurant-grid">
              {restaurants.map(res => (
                <RestaurantCard key={res._id} restaurant={res} onSelect={handleSelectRestaurant} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="page-header">
              <h2>{selectedRestaurant.name}</h2>
              <p>{selectedRestaurant.cuisine}</p>
              <button className="back-btn" onClick={() => setSelectedRestaurant(null)}>← Back to Restaurants</button>
            </div>
            <div className="menu-grid">
              {selectedRestaurant.menu.map(item => (
                <FoodCard key={item._id} item={{ ...item, restaurantId: selectedRestaurant._id }} addToCart={addToCart} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Menu;  
profile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle address input changes
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
};


  // Edit address
  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find(addr => addr.id === id);
    setCurrentAddress(addressToEdit);
    setEditingAddressId(id);
    setShowAddressForm(true);
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      localStorage.setItem("deliveryAddresses", JSON.stringify(updatedAddresses));
    }
  };

  // Set default address
  const handleSetDefault = (id) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
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
// Here you would typically save to a backend
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
              <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
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
                    <button onClick={() => handleSetDefault(address.id)}>
                      Set as Default
                    </button>
                  )}
                  <button onClick={() => handleEditAddress(address.id)}>
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile; 
resturantownerdashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const RestaurantOwnerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/orders/owner",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading-text">Loading orders...</p>;

  // ✅ MARK ORDER AS READY
  const markOrderReady = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/ready`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "READY" } : o
        )
      );
    } catch (err) {
      console.error("Failed to mark order as ready:", err);
    }
  };

  return (
    <div className="owner-dashboard">
      <h2 className="dashboard-title">Restaurant Owner Dashboard</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-6)}</span>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <p>
                <strong>Customer:</strong> {order.user?.name}
              </p>
              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>

              <div className="items-section">
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="order-time">
                Ordered at: {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* ✅ ACCEPT & PREPARE BUTTON */}
              {order.status === "PLACED" && (
                <button
                  className="btn-accept-prepare"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      await axios.patch(
                        `http://localhost:5000/api/orders/${order._id}/accept`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      setOrders((prev) =>
                        prev.map((o) =>
                          o._id === order._id
                            ? { ...o, status: "PREPARING" }
                            : o
                        )
                      );
                    } catch (err) {
                      console.error("Accept order failed:", err);
                    }
                  }}
                >
                  Accept & Prepare
                </button>
              )}

              {/* ✅ READY FOR DELIVERY BUTTON */}
              {order.status === "PREPARING" && (
                <button
                  className="btn-ready-delivery"
                  onClick={() => markOrderReady(order._id)}
                >
                  Ready for Delivery
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOwnerDashboard;
app.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TopBar from "./pages/TopBar";
import BottomNav from "./pages/BottomNav";
import "./assets/css/style.css";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Admin from "./pages/admin/Admin";
import RestaurantOwnerSetup from "./pages/ResturantOwnerSteup";
import DeliveryPartnerSetup from "./pages/DeliveryPartnerSetup";
import RestaurantPending from "./pages/ResturantPending";
import DeliveryPartnerPending from "./pages/DeliveryPartnerPending";
import RestaurantOwnerDashboard from "./pages/RestaurantOwnerDashboard";
import DeliveryPartnerDashboard from "./pages/DeliveryPartnerDashboard";

function Layout({ cart, addToCart, removeFromCart }) {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />  
        <Route path="/ResturantOwnerSetup" element={<RestaurantOwnerSetup />} /> 
        <Route path="/DeliveryPartnerSetup" element={<DeliveryPartnerSetup />} />     
        <Route path="/RestaurantPending" element={<RestaurantPending />} />
        <Route path="/DeliveryPartnerPending" element={<DeliveryPartnerPending />} />
        <Route path="/RestaurantOwnerDashboard" element={<RestaurantOwnerDashboard />} />        
        <Route path="/DeliveryPartnerDashboard" element={<DeliveryPartnerDashboard />} />

        <Route path="/home" element={<Home addToCart={addToCart} />} />
        <Route path="/orders" element={<Orders addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} addToCart={addToCart} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!["/", "/login","/RestaurantPending","/ResturantOwnerSetup","/profile","/DeliveryPartnerPending","/DeliveryPartnerSetup","/RestaurantOwnerDashboard","/DeliveryPartnerDashboard"].includes(location.pathname) && <BottomNav />}
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  // ✅ Add item to cart with restaurantId
  const addToCart = (item, restaurantId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem._id === item._id && cartItem.type === item.type
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id && cartItem.type === item.type
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, qty: 1, restaurantId }];
    });
  };

  // ✅ Remove one occurrence of item
  const removeFromCart = (item) => {
    setCart(prevCart => {
      return prevCart.reduce((acc, cartItem) => {
        if (cartItem._id === item._id && cartItem.type === item.type) {
          if (cartItem.qty > 1) {
            acc.push({ ...cartItem, qty: cartItem.qty - 1 });
          }
        } else {
          acc.push(cartItem);
        }
        return acc;
      }, []);
    });
  };

  return (
    <BrowserRouter>
      <Layout cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
    </BrowserRouter>
  );
}

export default App;

db.js


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB
admincontroller.js
import Restaurant from "../models/Restaurant.js";
import DeliveryPartner from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";

/* ===============================
   ADMIN: Approve Restaurant
================================ */
export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.approved = true;
    await restaurant.save();

    res.status(200).json({ message: "Restaurant approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve restaurant" });
  }
};

/* ===============================
   ADMIN: approve delivery partner
================================ */
export const approveDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    partner.isApproved = true; 
    await partner.save();

    res.json({ message: "Delivery partner approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN: Get Pending Restaurants
================================ */
export const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: false })
      .populate("owner", "name email");

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

/* ===============================
   ADMIN: Get Pending Delivery Partners
================================ */
export const getPendingDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({isApproved: false  })
      .populate("user", "name email");

    res.status(200).json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pending delivery partners" });
  }
};

/*====================================
assigning order to delivery partner
====================================*/
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.status !== "READY") {
      return res.status(400).json({ message: "Order not ready" });
    }

    const partner = await DeliveryPartner.findById(partnerId);
    if (!partner || partner.status !== "FREE") {
      return res.status(400).json({ message: "Partner not available" });
    }

    // assign
    order.deliveryPartner = partner._id;
    order.status = "OUT_FOR_DELIVERY";

    partner.currentOrder = order._id;
    partner.status = "ASSIGNED";

    await order.save();
    await partner.save();

    res.json({ message: "Delivery partner assigned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Assignment failed" });
  }
};
/*===================================
identify free delivery partner
===================================*/

export const getFreeDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({
      isApproved: true,
      status: "FREE",
    }).populate("user", "name email");

    res.json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch partners" });
  }
};
authcontroller.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   SIGNUP CONTROLLER
========================= */

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔒 Allow only ONE admin
    if (role === "admin") {
      const adminExists = await User.findOne({ role: "admin" });

      if (adminExists) {
        return res.status(403).json({
          message: "Admin already exists"
        });
      }
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "Signup successful"
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   LOGIN CONTROLLER
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔹 Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 🔹 Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
deliverypartnercontroller.js
import DeliveryPartner from "../models/DeliveryPartner.js";

/* REGISTER DELIVERY PARTNER */
export const registerDeliveryPartner = async (req, res) => {
  try {
    const existing = await DeliveryPartner.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Already registered" });
    }

    const aadhaarPath = req.files?.aadhaar?.[0]?.filename;
    const drivingPath = req.files?.drivingLicense?.[0]?.filename;

    const partner = await DeliveryPartner.create({
      user: req.user.id,
      phone: req.body.phone,
      address: req.body.address,
      aadhaar: aadhaarPath,
      drivingLicense: drivingPath,
      isApproved: false
    });

    res.status(201).json({
      message: "Delivery partner registered",
      partner
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register" });
  }
};


/* GET MY DELIVERY PARTNER (NEW) */
export const getMyDeliveryPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({ user: req.user.id })
      .populate("user", "name email")
      .populate({
        path: "currentOrder",
        populate: [
          { path: "user", select: "name" },
          { path: "restaurant", select: "name" }
        ]
      });

    if (!partner) {
      return res.status(404).json({ message: "Not registered" });
    }

    res.json(partner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


ordercontroller.js
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";

/* ===============================
   USER → PLACE ORDER
================================ */
export const placeOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount, paymentMethod } = req.body;

    if (!restaurant)
      return res.status(400).json({ message: "Restaurant ID is required" });
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Order items required" });
    if (!totalAmount)
      return res.status(400).json({ message: "Total amount required" });

    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items,
      totalAmount,
      paymentMethod,
      status: "PLACED",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Order failed", error: error.message });
  }
};

/* ===============================
   OWNER → GET ALL ORDERS
================================ */
export const getOwnerOrders = async (req, res) => {
  try {
    // 1️⃣ Find restaurants owned by this user
    const restaurants = await Restaurant.find({ owner: req.user.id }).select("_id");

    if (!restaurants.length) {
      return res.json([]); // owner has no restaurants
    }

    // 2️⃣ Extract restaurant IDs
    const restaurantIds = restaurants.map(r => r._id);

    // 3️⃣ Fetch orders ONLY for these restaurants
    const orders = await Order.find({
      restaurant: { $in: restaurantIds }
    })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get owner orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ===============================
   OWNER → ACCEPT / PREPARE ORDER
================================ */
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "PREPARING";
    await order.save();

    res.json({ message: "Order accepted & preparing", order });
  } catch (error) {
    console.error("Accept order error:", error);
    res.status(500).json({ message: "Failed to accept order" });
  }
};

/* ===============================
   OWNER → MARK ORDER AS READY
================================ */
export const markOrderReady = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "READY";
    await order.save();

    // Optional: notify admin via Socket.io
    if (req.io) {
      req.io.emit("order_ready", {
        orderId: order._id,
        restaurant: order.restaurant,
      });
    }

    res.json({ success: true, message: "Order marked as ready", order });
  } catch (err) {
    console.error("markOrderReady error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===============================
   ADMIN → GET PREPARING ORDERS
================================ */
export const getPreparingOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ status: "PREPARING" })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin preparing orders fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* ===============================
   ADMIN → GET READY ORDERS
================================ */
export const getReadyOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ status: "READY" })
      .populate("user", "name email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin ready orders fetch error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/*==========================
      order deliverd
========================*/
export const markDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    const partner = await DeliveryPartner.findOne({
      user: req.user.id
    });

    if (!order || !partner) {
      return res.status(404).json({ message: "Not found" });
    }

    order.status = "DELIVERED";
    partner.status = "FREE";
    partner.currentOrder = null;

    await order.save();
    await partner.save();

    res.json({ message: "Order delivered" });
  } catch (error) {
    res.status(500).json({ message: "Failed" });
  }
};
resturantcontroller.js
import Restaurant from "../models/Restaurant.js";

/* OWNER: Create Restaurant */
export const createRestaurant = async (req, res) => {
  try {
    const { name, address, cuisine, openTime, closeTime, description, menu } = req.body;

    if (!req.files || !req.files["restaurantImage"] || req.files["restaurantImage"].length === 0) {
      return res.status(400).json({ success: false, message: "Restaurant image is required" });
    }

    const restaurantImage = req.files["restaurantImage"][0].filename;

    const menuImages = req.files["menuImages"] || [];
    let menuWithImages = [];

    if (menu) {
      const parsedMenu = typeof menu === "string" ? JSON.parse(menu) : menu;

      menuWithImages = parsedMenu.map((item, index) => ({
        ...item,
        image: menuImages[index]?.filename || null,
      }));
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      cuisine,
      openTime,
      closeTime,
      description,
      image: restaurantImage,
      menu: menuWithImages,
      owner: req.user.id,
      approved: false,
    });

    res.status(201).json({ success: true, message: "Restaurant registered, pending admin approval", restaurant });
  } catch (error) {
    console.error("Create restaurant error:", error);
    res.status(500).json({ success: false, message: "Failed to create restaurant" });
  }
};

/* USER: Get approved restaurants */
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: true }).populate("owner", "name email");
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Get restaurants error:", error);
    res.status(500).json({ message: "Failed to fetch restaurants" });
  }
};

/* ADMIN: Get pending restaurants */
export const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approved: false }).populate("owner", "name email");
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Get pending restaurants error:", error);
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

/* OWNER: Get My Restaurant */
export const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "No restaurant found" });
    res.status(200).json(restaurant);
  } catch (error) {
    console.error("Get my restaurant error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
usercontroller.js
import User from "../models/User.js";

/* GET PROFILE */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.name = req.body.name;
  user.phone = req.body.phone;
  await user.save();
  res.json(user);
};

/* ADD / UPDATE ADDRESS */
export const saveAddresses = async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses = req.body.addresses;
  await user.save();
  res.json(user.addresses);
};
authmiddleware.js


import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

rolemiddleware.js
   

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: String,

  

    deliveryPartner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "DeliveryPartner",
  default: null
},
status: {
  type: String,
  enum: ["PLACED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"],
  default: "PLACED"
}
user.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,
  street: String,
  apartment: String,
  landmark: String,
  city: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["user", "admin", "owner", "delivery"],
    default: "user"
  },
  phone: String,
  addresses: [addressSchema]
}, { timestamps: true });

export default mongoose.model("User", userSchema);

adminroute.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  approveRestaurant,
  approveDeliveryPartner,
  getPendingRestaurants,
  getPendingDeliveryPartners,
  getFreeDeliveryPartners,
  assignDeliveryPartner
} from "../controllers/adminController.js";

const router = express.Router();

/* ===== FETCH PENDING ===== */
router.get(
  "/restaurants/pending",
  protect,
  allowRoles("admin"),
  getPendingRestaurants
);

router.get(
  "/delivery/pending",
  protect,
  allowRoles("admin"),
  getPendingDeliveryPartners
);

/* ===== APPROVE ===== */
router.put(
  "/restaurants/approve/:id",
  protect,
  allowRoles("admin"),
  approveRestaurant
);

router.put(
  "/delivery/approve/:id",
  protect,
  allowRoles("admin"),
  approveDeliveryPartner
);

router.post(
  "/assign-delivery",
  protect,
  allowRoles("admin"),
  assignDeliveryPartner
);

router.get(
  "/delivery/free",
  protect,
  allowRoles("admin"),
  getFreeDeliveryPartners
);


export default router;
authroute.js
import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
deliverypartnerroute.js
import express from "express";
import {
  registerDeliveryPartner,
  getMyDeliveryPartner
} from "../controllers/deliveryPartnerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("delivery"),
  upload.fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 }
  ]),
  registerDeliveryPartner
);

router.get("/my", protect, allowRoles("delivery"), getMyDeliveryPartner);

export default router; 
orderroute.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js"; // ✅ FIX ADDED
import Order from "../models/Order.js"; 
import DeliveryPartner from "../models/DeliveryPartner.js";
import {
  placeOrder,
  getOwnerOrders,
  acceptOrder,
  markOrderReady,
  getPreparingOrdersForAdmin,
  getReadyOrdersForAdmin,
  markDelivered,
} from "../controllers/orderController.js";

const router = express.Router();

// USER → place order
router.post("/", protect, placeOrder);

// OWNER → view orders
router.get("/owner", protect, getOwnerOrders);

// OWNER → accept order
router.patch("/:id/accept", protect, acceptOrder);

// OWNER → mark order as READY
router.patch("/:id/ready", protect, markOrderReady);

// ADMIN → view preparing orders
router.get("/admin/preparing", protect, allowRoles("admin"), getPreparingOrdersForAdmin);

// ADMIN → view READY orders
router.get("/admin/ready", protect, allowRoles("admin"), getReadyOrdersForAdmin);

// DELIVERY PARTNER → mark order delivered
router.patch(
  "/:id/delivered",
  protect,
  allowRoles("delivery"),
  markDelivered
);
// DELIVERY PARTNER → GET assigned orders
router.get(
  "/delivery/my-orders",
  protect,
  allowRoles("delivery"),  // only delivery partners can access
  async (req, res) => {
    try {
      // First, get the DeliveryPartner ID of the logged-in user
      const partner = await DeliveryPartner.findOne({ user: req.user.id });
      if (!partner) {
        return res.status(404).json({ message: "Delivery partner profile not found" });
      }

      // Fetch orders assigned to this partner
      const orders = await Order.find({ deliveryPartner: partner._id })
        .populate("restaurant", "name")
        .populate("user", "name email");

      res.json(orders);
    } catch (error) {
      console.error("Failed to fetch delivery partner orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  }
);


export default router;

resturantroute.js
import express from "express";
import { createRestaurant, getRestaurants, getPendingRestaurants, getMyRestaurant } from "../controllers/restaurantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

/* USER: Get approved restaurants */
router.get("/", getRestaurants);

/* OWNER: Create restaurant with images */
router.post(
  "/",
  protect,
  allowRoles("owner"),
  upload.fields([
    { name: "restaurantImage", maxCount: 1 },
    { name: "menuImages", maxCount: 10 },
  ]),
  createRestaurant
);

/* OWNER: Get own restaurant */
router.get("/my", protect, allowRoles("owner"), getMyRestaurant);

/* ADMIN: Get pending restaurants */
router.get("/pending", protect, allowRoles("admin"), getPendingRestaurants);

export default router;
userroute.js
import express from "express";
import {
  getProfile,
  updateProfile,
  saveAddresses
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/addresses", protect, saveAddresses);

export default router;
server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import deliveryPartnerRoutes from "./routes/deliveryPartnerRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery-partners", deliveryPartnerRoutes);
app.use("/api/user", userRoutes);

// serve images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Foodify API Running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 


these are file now i want that in delivery partner dashboard adress should be fetch from user profile currently adress is n/a fix this as i belive u are 20 years experienced dev 