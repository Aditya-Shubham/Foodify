/*project*/
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
        

        <Route path="/home" element={<Home addToCart={addToCart} />} />
        <Route path="/orders" element={<Orders addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} addToCart={addToCart} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Show BottomNav everywhere EXCEPT signup page & login page */}
      
      {!["/", "/login","/RestaurantPending","/ResturantOwnerSetup","/profile","/DeliveryPartnerPending","/DeliveryPartnerSetup",].includes(location.pathname) && <BottomNav />}

    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
  setCart(prevCart => {
    // ✅ Use _id + type to distinguish Veg / Non-Veg
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

    return [...prevCart, { ...item, qty: 1 }];
  });
};


  // Remove one occurrence of item from cart
  const removeFromCart = (item) => {
  setCart(prevCart => {
    return prevCart.reduce((acc, cartItem) => {
      if (cartItem._id === item._id && cartItem.type === item.type) {
        if (cartItem.qty > 1) {
          acc.push({ ...cartItem, qty: cartItem.qty - 1 });
        }
        // qty = 1 → remove the item completely
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
