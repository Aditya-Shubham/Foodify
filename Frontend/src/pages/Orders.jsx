import React, { useState } from "react";
import TopBar from "./TopBar";

/* ---------- DATA (Later comes from DB/API) ---------- */

const restaurants = [
  {
    id: 1,
    name: "Spice Hub",
    cuisine: "Indian, Mughlai",
    rating: 4.5,
    menu: [
      {
        id: 101,
        name: "Chicken Biryani",
        price: 180,
        type: "non-veg",
        rating: 4.6,
        img: "/public/chicken_briyani.jpg",
      },
      {
        id: 102,
        name: "Paneer Butter Masala",
        price: 130,
        type: "veg",
        rating: 4.3,
        img: "/public/paneer-butter-masala-2.jpg",
      },
    ],
  },
  {
    id: 2,
    name: "Burger Junction",
    cuisine: "Fast Food",
    rating: 4.2,
    menu: [
      {
        id: 201,
        name: "Veg Burger",
        price: 60,
        type: "veg",
        rating: 4.0,
        img: "/public/veg_burger.jpg",
      },
      {
        id: 202,
        name: "Chicken Burger",
        price: 110,
        type: "non-veg",
        rating: 4.2,
        img: "/public/chicken burger.png",
      },
    ],
  },
{
    id: 3,
    name: "pizaa point",
    cuisine: "Italian",
    rating: 4.2,
    menu: [
      {
        id: 301,
         name: "Farmhouse Pizza",
         price: 190,
         type: "veg",
        rating: 4.4,
        img: "public/Farmhouse_Pizza.webp"
      },
      {
        id: 302,
        name: "Margherita pizza",
        price: 120,
        type: "veg",
        rating: 4.1,
        img: "public/margherita-pizza-recipe.jpg"
      },
      {
        id: 303,
        name: "Chicken Pizza",
        price: 230,
        type: "non-veg",
        rating: 4.8,
        img: "public/chicken_pizza.jpeg"
      },
    ],
  },
{
    id: 4,
    name: "Southern Spice",
    cuisine: "South Indian",
    rating: 4.3,
    menu: [
      {
        id: 401,
       name: "Masala Dosa",
       price: 70,
       type: "veg",
       rating: 4,
       img: "public/Masala dosa.jpg"
      },
      {
        id: 402,
        name: "vada(4pieces)",
        price: 60,
        type: "veg",
        rating: 4.2,
        img: "public/southindian2.jpg",
      },
{
        id: 403,
       name: "idli(4pieces)",
       price: 40,
       type: "veg",
       rating: 4,
       img: "public/southindian4.jpg"
      },

    ],
  },
{
    id: 5,
    name: "Grill House",
    cuisine: "grill, BBQ",
    rating: 4.2,
    menu: [
      {
        id: 501,
        name: "Grilled tandoori Chicken",
        price: 180,
        type: "non-veg",
        rating: 4.6,
        img: "public/Grilled_Tandoori_Chicken.webp",
      },
      {
        id: 502,
        name: "Grilled fish",
        price: 130,
        type: "veg",
        rating: 4.3,
        img: "public/grilled_fish.jpg",
      },
    ],
  },
{
    id: 6,
    name: "Dragon Bowl",
    cuisine: "IndoChinese",
    rating: 4.6,
    menu: [
      {
        id: 601,
          name: "chicken Shawarma",
          price: 80,
          type: "non-veg",
          rating: 4.4,
          img: "public/chicken-shawarma.jpg"
      },
      {
        id: 602,
        name: "Chicken chilli",
        price: 100,
        type: "non-veg",
        rating: 4.3,
        img: "public/chicken-chilli-gravy.jpg"
      },
    ],
  },
{
    id: 7,
    name: "Bake house",
    cuisine: "Bakery",
    rating: 4.5,
    menu: [
      {
        id: 701,
        name: "chocolate cake",
        price: 180,
        type: "non-veg",
        rating: 4.6,
        img: "public/cake1.jpg",
      },
      {
        id: 702,
        name: "eggless Vanilla cake",
        price: 130,
        type: "veg",
        rating: 4.3,
        img: "public/cake2.jpeg",
      },
    ],
  },
{
    id: 8,
    name: "Sweet cravings",
    cuisine: "Desserts",
    rating: 4.4,
    menu: [
      {
        id: 801,
        name: "gulab jamun(3pieces)",
        price: 60,
        type: "veg",
        rating: 4.6,
        img: "public/sweet1.webp",
      },
      {
        id: 802,
        name: "rasgulla(3pieces)",
        price: 60,
        type: "veg",
        rating: 4.3,
        img: "public/sweet2.jpeg",
      },
         {
        id: 803,
        name: "Rasmalai(3pieces)",
        price: 90,
        type: "veg",
        rating: 4.6,
        img: "public/sweet3.jpg",
      },
       {
        id: 804,
        name: "motichoor ladoo(3pieces)",
        price: 30,
        type: "veg",
        rating: 4.6,
        img: "public/sweet4.webp",
      },



    ],
  },



];


/* ---------- COMPONENTS ---------- */

const RestaurantCard = ({ restaurant, onSelect }) => (
  <div className="restaurant-card" onClick={() => onSelect(restaurant)}>
    <h3>{restaurant.name}</h3>
    <p>{restaurant.cuisine}</p>
    <span>⭐ {restaurant.rating}</span>
  </div>
);

const FoodCard = ({ item, addToCart }) => (
  <div className="food-card">
    <img src={item.img} alt={item.name} />

    <div className="food-info">
      <h4>{item.name}</h4>
      <p className={`food-type ${item.type}`}>
        {item.type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"}
      </p>

      <div className="food-bottom">
        <span>₹{item.price}</span>
        <span>⭐ {item.rating}</span>
      </div>

      <button className="add-btn" onClick={() => addToCart(item)}>
        ADD
      </button>
    </div>
  </div>
);

/* ---------- MAIN PAGE ---------- */

const Menu = ({ addToCart }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
                  key={res.id}
                  restaurant={res}
                  onSelect={setSelectedRestaurant}
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
                  key={item.id}
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

