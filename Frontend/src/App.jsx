import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


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

/* ======================
   HELPER → GET USER ID
====================== */
const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.id;
  } catch {
    return null;
  }
};

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
        <Route
          path="/cart"
          element={<Cart cart={cart} removeFromCart={removeFromCart} addToCart={addToCart} />}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {![
        "/",
        "/login",
        "/RestaurantPending",
        "/ResturantOwnerSetup",
        "/profile",
        "/DeliveryPartnerPending",
        "/DeliveryPartnerSetup",
        "/RestaurantOwnerDashboard",
        "/DeliveryPartnerDashboard"
      ].includes(location.pathname) && <BottomNav />}
    </>
  );
}

function App() {
  const userId = getUserId();

  const cartKey = userId ? `cart_${userId}` : null;

  const [cart, setCart] = useState(() => {
    if (!cartKey) return [];
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  /* ======================
     SAVE CART (PER USER)
  ====================== */
  useEffect(() => {
    if (!cartKey) return;
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  /* ======================
     ADD TO CART
  ====================== */
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

  /* ======================
     REMOVE FROM CART
  ====================== */
  const removeFromCart = (item) => {
    setCart(prevCart =>
      prevCart.reduce((acc, cartItem) => {
        if (cartItem._id === item._id && cartItem.type === item.type) {
          if (cartItem.qty > 1) acc.push({ ...cartItem, qty: cartItem.qty - 1 });
        } else {
          acc.push(cartItem);
        }
        return acc;
      }, [])
    );
  };

  return (
    <BrowserRouter>
      <Layout cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
    </BrowserRouter>
  );
}

export default App;

