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

import AdminDashboard from "./pages/admin/AdminDashboard";
import RestaurantOwnerSetup from "./pages/ResturantOwnerSteup";
import DeliveryPartnerSetup from "./pages/DeliveryPartnerSetup";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";

import ProtectedRoute from "./pages/ProtectedRoute";


function Layout({ cart, addToCart,setCart, removeFromCart }) {
  const location = useLocation();

  return (
    <>
      <Routes>

  {/* PUBLIC ROUTES */}
  <Route path="/" element={<Signup />} />
  <Route path="/login" element={<Login />} />

  {/* USER */}
  <Route
    path="/home"
    element={
      <ProtectedRoute allowedRoles={["user"]}>
        <Home addToCart={addToCart} />
      </ProtectedRoute>
    }
  />

  <Route
    path="/orders"
    element={
      <ProtectedRoute allowedRoles={["user"]}>
        <Orders addToCart={addToCart} />
      </ProtectedRoute>
    }
  />

  <Route
    path="/cart"
    element={
      <ProtectedRoute allowedRoles={["user"]}>
        <Cart
          cart={cart}
          setCart={setCart}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
        />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute allowedRoles={["user", "delivery", "owner", "admin"]}>
        <Profile />
      </ProtectedRoute>
    }
  />

  {/* RESTAURANT DASHBOARD */}
        <Route
          path="/restaurant"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />

  {/* RESTAURANT OWNER */}
  <Route
    path="/ResturantOwnerSetup"
    element={
      <ProtectedRoute allowedRoles={["owner"]}>
        <RestaurantOwnerSetup />
      </ProtectedRoute>
    }
  />

  {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
  />

  {/* DELIVERY PARTNER */}
  <Route
    path="/DeliveryPartnerSetup"
    element={
      <ProtectedRoute allowedRoles={["delivery"]}>
        <DeliveryPartnerSetup />
      </ProtectedRoute>
    }
  />

  <Route
    path="/delivery"
    element={
      <ProtectedRoute allowedRoles={["delivery"]}>
        <DeliveryDashboard />
      </ProtectedRoute>
    }
  />

</Routes>

      {/* Show BottomNav everywhere EXCEPT signup page & login page */}
      
      {!["/", "/login"].includes(location.pathname) && <BottomNav />}

    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
  setCart((prev) => [
    ...prev,
    {
      ...item,
      id: item.id || item._id, // normalize ID
    },
  ]);
};

  // Remove one occurrence of item from cart
  const removeFromCart = (itemId) => {
  setCart((prevCart) => {
    const index = prevCart.findIndex(
      (item) => item.id === itemId || item._id === itemId
    );

    if (index === -1) return prevCart;

    const updatedCart = [...prevCart];
    updatedCart.splice(index, 1); // remove only ONE item

    return updatedCart;
  });
};

  return (
    <BrowserRouter>
      <Layout cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
    </BrowserRouter>
  );
}

export default App;
