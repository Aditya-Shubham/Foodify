import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "./TopBar";

/* -------------------- CARDS -------------------- */

const RestaurantCard = ({ restaurant, onSelect }) => (
  <div className="restaurant-card" onClick={() => onSelect(restaurant._id)}>
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

const FoodCard = ({ item, addToCart, restaurantId }) => (
  <div className="food-card">
    {item.image && (
      <img
        src={`http://localhost:5000/uploads/menu/${item.image}`}
        alt={item.name}
        className="food-img"
      />
    )}
    <div className="food-info">
      <h4>{item.name}</h4>

      <span className={`food-type ${item.type === "VEG" ? "veg" : "nonveg"}`}>
        {item.type === "VEG" ? "🟢 Veg" : "🔴 Non-Veg"}
      </span>

      <div className="food-bottom">
        <span>₹{item.price}</span>
      </div>

      <button
        className="add-btn"
        onClick={() => addToCart(item, restaurantId)}
      >
        ADD
      </button>
    </div>
  </div>
);

/* -------------------- MENU -------------------- */

const Menu = ({ addToCart }) => {
  // 🔑 SOURCE OF TRUTH
  const [restaurants, setRestaurants] = useState([]);

  // UI STATE
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // FILTER STATE
  const [isVeg, setIsVeg] = useState(null); // null = ALL
  const [searchQuery, setSearchQuery] = useState("");

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  /* ---------- DERIVED DATA ---------- */
  const selectedRestaurant = restaurants.find(
    (r) => r._id === selectedRestaurantId
  );

  /* ---------- SEARCH HANDLER ---------- */
  const handleSearch = (query, vegFilter) => {
    setSearchQuery(query);
    setIsVeg(vegFilter);

    if (!query) {
      setFilteredRestaurants(restaurants);
      return;
    }

    const filtered = restaurants.filter((res) =>
      res.name.toLowerCase().includes(query)
    );

    setFilteredRestaurants(filtered);
  };

  /* ---------- MENU FILTER ---------- */
  const getFilteredMenu = () => {
    if (!selectedRestaurant) return [];

    return selectedRestaurant.menu.filter((item) => {
      const matchSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery)
        : true;

      const matchVeg =
        isVeg === null
          ? true
          : isVeg
          ? item.type === "VEG"
          : item.type === "NON_VEG";

      return matchSearch && matchVeg;
    });
  };

  return (
    <>
      <TopBar
        isVeg={isVeg}
        setIsVeg={setIsVeg}
        onSearch={handleSearch}
      />

      <div className="page">
        {!selectedRestaurant ? (
          <>
            <div className="page-header">
              <h2>Select a Restaurant</h2>
              <p>Choose from top-rated restaurants near you</p>
            </div>

            <div className="restaurant-grid">
              {filteredRestaurants.map((res) => (
                <RestaurantCard
                  key={res._id}
                  restaurant={res}
                  onSelect={setSelectedRestaurantId}
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
                onClick={() => setSelectedRestaurantId(null)}
              >
                ← Back to Restaurants
              </button>
            </div>

            <div className="menu-grid">
              {getFilteredMenu().map((item) => (
                <FoodCard
                  key={item._id}
                  item={item}
                  restaurantId={selectedRestaurant._id}
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
