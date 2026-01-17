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
    setCart([...cart, item]);
  };

  // Remove one occurrence of item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const index = prevCart.findIndex(item => item.id === id);
      if (index === -1) return prevCart;
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  };

  return (
    <BrowserRouter>
      <Layout cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
    </BrowserRouter>
  );
}

export default App;
