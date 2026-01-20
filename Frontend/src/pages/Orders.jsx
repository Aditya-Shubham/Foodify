import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "./TopBar";

/* ---------- COMPONENTS ---------- */

const RestaurantCard = ({ restaurant, onSelect }) => (
  <div className="restaurant-card" onClick={() => onSelect(restaurant)}>
    
    {/* ✅ Restaurant Image */}
    {restaurant.image && (
      <img
        src={`http://localhost:5000/uploads/restaurants/${restaurant.image}`}
        alt={restaurant.name}
        className="restaurant-img"
      />
    )}

    <h3>{restaurant.name}</h3>
    <p>{restaurant.cuisine}</p>
  </div>
);

const FoodCard = ({ item, addToCart }) => (
  <div className="food-card">
    
    {/* ✅ Food Image */}
    {item.image && (
      <img
        src={`http://localhost:5000/uploads/menu/${item.image}`}
        alt={item.name}
        className="food-img"
      />
    )}

    <div className="food-info">
      <h4>{item.name}</h4>

      <div className="food-bottom">
        <span>₹{item.price}</span>
      </div>

      <button
        className="add-btn"
        onClick={() =>
          addToCart({
            _id: item._id,
            name: item.name,
            price: item.price,
          })
        }
      >
        ADD
      </button>
    </div>
  </div>
);

/* ---------- MAIN PAGE ---------- */

const Menu = ({ addToCart }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // ✅ Fetch restaurants from DB
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      }
    };

    fetchRestaurants();
  }, []);

  // ✅ Store selected restaurant ID
  const handleSelectRestaurant = (restaurant) => {
    localStorage.setItem("selectedRestaurantId", restaurant._id);
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
              {restaurants.map((res) => (
                <RestaurantCard
                  key={res._id}
                  restaurant={res}
                  onSelect={handleSelectRestaurant}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="page-header">
              <h2>{selectedRestaurant.name}</h2>
              <p>{selectedRestaurant.cuisine}</p>
              <button
                className="back-btn"
                onClick={() => setSelectedRestaurant(null)}
              >
                ← Back to Restaurants
              </button>
            </div>

            <div className="menu-grid">
              {selectedRestaurant.menu.map((item) => (
                <FoodCard
                  key={item._id}
                  item={item}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Menu;