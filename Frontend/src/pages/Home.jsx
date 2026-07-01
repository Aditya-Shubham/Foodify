
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecommendations } from "../services/recommendationService";

const Home = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
const [recommendationData, setRecommendationData] = useState(null);
const [showAll, setShowAll] = useState(false);

useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations();
      setRecommendationData(data);
    } catch (error) {
      console.error("Recommendation Error:", error);
    }
  };

  fetchRecommendations();
}, []);

  // Load addresses from localStorage on component mount
  useEffect(() => {
    const savedAddresses = localStorage.getItem("deliveryAddresses");
    if (savedAddresses) {
      const parsedAddresses = JSON.parse(savedAddresses);
      setAddresses(parsedAddresses);
      
      // Set default address or first address
      const defaultAddr = parsedAddresses.find(addr => addr.isDefault);
      setSelectedAddress(defaultAddr || parsedAddresses[0] || null);
    }
  }, []);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Select delivery location";
    return `${address.label} - ${address.street}, ${address.city}`;
  };

  // Handle address selection
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setShowAddressDropdown(false);
    localStorage.setItem("selectedAddress", JSON.stringify(address));
  };

// Best recommendation (Hero Card)
const bestRecommendation =
  recommendationData?.recommendations?.[0];

// Remaining recommendations
const otherRecommendations =
  recommendationData?.recommendations?.slice(1) || [];

const visibleRecommendations = showAll
  ? otherRecommendations
  : otherRecommendations.slice(0, 6);

  return (
    <div className="page home">
      {/* TOP NAVIGATION BAR */}
      <div className="top-nav">
        <div 
          className="address-section" 
          onClick={() => {
            if (addresses.length === 0) {
              navigate("/profile");
            } else {
              setShowAddressDropdown(!showAddressDropdown);
            }
          }}
        >
          <span className="location-icon">📍</span>
          <div className="address-text">
            <span className="deliver-to">Deliver to</span>
            <span className="address-main">
              {selectedAddress ? formatAddress(selectedAddress) : "Select delivery location"}
            </span>
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>

        {/* Address Dropdown */}
        {showAddressDropdown && addresses.length > 0 && (
          <div className="address-dropdown">
            <div className="dropdown-header">
              <h3>Select Delivery Address</h3>
              <button 
                className="close-dropdown"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddressDropdown(false);
                }}
              >
                ✕
              </button>
            </div>
            
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`dropdown-address-item ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAddress(address);
                }}
              >
                <div className="address-item-label">
                  {address.label}
                  {address.isDefault && <span className="default-tag">Default</span>}
                </div>
                <div className="address-item-details">
                  {address.street}, {address.city} - {address.pincode}
                </div>
              </div>
            ))}
            
            <button 
              className="add-new-address-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/profile");
              }}
            >
              + Add New Address
            </button>
          </div>
        )}

        <div className="profile-section" onClick={() => navigate("/profile")}>
          <div className="profile-avatar">
            <span>👤</span>
          </div>
        </div>
      </div>

 




      {/* HERO SECTION */}
      <section className="hero-premium">


        <h1>
          Good food is not a luxury.<br />
          It's a need 😌
        </h1>
        <p>
          Freshly prepared meals, delivered hot.<br />
          Just the way you like it.
        </p>

        <button className="cta-primary" onClick={() => navigate("/orders")}>
          Explore Menu 🍽️
        </button>
      </section>

{/* AI RECOMMENDATION SECTION */}
{bestRecommendation && (
  <section className="recommendation-section">

    <div className="recommendation-header">

      <div>
        <h2>{recommendationData.greeting}</h2>

        <p>
          Perfect {recommendationData.meal.toLowerCase()} picks for this{" "}
          {recommendationData.season.toLowerCase()}.
        </p>
      </div>

      <span className="ai-badge">
        🤖 Foodify AI
      </span>

    </div>

    {/* HERO CARD */}

    <div className="hero-recommendation">

      <img
        src={`http://localhost:5000/uploads/menu/${bestRecommendation.image}`}
        alt={bestRecommendation.foodName}
      />

      <div className="hero-content">

               <h2>{bestRecommendation.foodName}</h2>

        <p className="restaurant-name">
          {bestRecommendation.restaurantName}
        </p>

        <div className="hero-footer">

          <span className="price">
            ₹{bestRecommendation.price}
          </span>

          <button
            className="order-btn"
            onClick={() => navigate("/orders")}
          >
            Order Now 
          </button>

        </div>

      </div>

    </div>

    {/* MORE RECOMMENDATIONS */}

    {otherRecommendations.length > 0 && (
      <>
        <h3 className="more-title">
          More Recommendations
        </h3>

        <div className="recommendation-grid">
  {visibleRecommendations.map((item) => (
    <div className="recommendation-card" key={item._id}>
     <img
  src={`http://localhost:5000/uploads/menu/${item.image}`}
  alt={item.foodName}
/>
      <div className="recommendation-info">
       <h3>{item.foodName}</h3>
<p>{item.restaurantName}</p>
<h4>₹{item.price}</h4>
<button
            className="order-btn"
            onClick={() => navigate("/orders")}
          >
            Order Now 
          </button>
      </div>
    </div>
  ))}
</div>

      </>
    )}

  </section>
)}


      {/* TRUST SIGNALS */}
      <section className="trust-strip">
        <div>⭐ 4.6 Rated</div>
        <div>🚀 Fast Delivery</div>
        <div>🥗 Fresh Ingredients</div>
        <div>❤️ Loved by Students</div>
      </section>

      {/* MOOD BASED DISCOVERY */}
      <section className="mood-section">
        <h2>What are you craving right now?</h2>
        <p className="subtext">Don't think. Just feel.</p>

        <div className="mood-grid">
          <div className="mood-card">🍕 Comfort Food</div>
          <div className="mood-card">🍗 Protein & Power</div>
          <div className="mood-card">🥘 Indian Classics</div>
          <div className="mood-card">🥗 Light & Healthy</div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="social-proof">
        <h2>Why people keep coming back</h2>

        <div className="reviews">
          <div className="review">
            "Perfect for late-night study hunger." ⭐⭐⭐⭐⭐
          </div>
          <div className="review">
            "Affordable, tasty, and always on time." ⭐⭐⭐⭐⭐
          </div>
          <div className="review">
            "Feels like home food, honestly." ⭐⭐⭐⭐☆
          </div>
        </div>
      </section>

      {/* OFFER SECTION */}
      <section className="offer-banner-premium">
        <h2>First order deserves a reward 🎁</h2>
        <p>Get flat 40% OFF — no conditions</p>

        <button className="cta-secondary" onClick={() => navigate("/orders")}>
          Order Now
        </button>
      </section>

      {/* EMOTIONAL CLOSURE */}
      <section className="emotion">
        <h2>Food understands you ❤️</h2>
        <p>
          When you're tired.<br />
          When you're happy.<br />
          When you don't want to cook.
        </p>
      </section>
    </div>
  );
};

export default Home;