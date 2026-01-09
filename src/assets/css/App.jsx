/*project*/
/*
import React, { useState } from "react";
import { BrowserRouter, Routes, Route,useLocation,useNavigate } from "react-router-dom";
import TopBar from "./pages/TopBar";
import BottomNav from "./pages/BottomNav";
import "./assets/css/style.css";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Admin from "./pages/admin/Admin";

function App() {
  // Cart state
  const [cart, setCart] = useState([]);

  // Function to add item to cart
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  );
}

export default App;*/


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

import Signup from "./pages/Signup";

import Admin from "./pages/admin/Admin";
import RestaurantOwnerSetup from "./pages/ResturantOwnerSteup";
import DeliveryPartnerSetup from "./pages/DeliveryPartnerSetup";


function Layout({ cart, addToCart, removeFromCart }) {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/admin" element={<Admin />} />  
        <Route path="/ResturantOwnerSetup" element={<RestaurantOwnerSetup />} /> 
        <Route path="/DeliveryPartnerSetup" element={<DeliveryPartnerSetup />} />     
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<Home addToCart={addToCart} />} />
        <Route path="/orders" element={<Orders addToCart={addToCart} />} />
        <Route
  path="/cart"
  element={
    <Cart
      cart={cart}
      addToCart={addToCart}   // 👈 THIS IS THE FIX
      removeFromCart={removeFromCart}
    />
  }
/>
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Show BottomNav everywhere EXCEPT signup page */}
      {location.pathname !== "/" && <BottomNav />}
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