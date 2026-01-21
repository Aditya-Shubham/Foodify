import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantOwnerSetup = () => {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    cuisine: "",
    openTime: "",
    closeTime: "",
    image: null,
    menu: [{ name: "", price: "", type: "VEG", image: null }],

  });

  const handleChange = (e, index = null) => {
  const { name, value, files } = e.target;

  // Restaurant image
  if (name === "restaurantImage" && index === null) {
    setRestaurant({ ...restaurant, image: files[0] });
  }

  // Menu image
  else if (name === "menuImages" && index !== null) {
    const newMenu = [...restaurant.menu];
    newMenu[index].image = files[0];
    setRestaurant({ ...restaurant, menu: newMenu });
  }

  // Menu text fields
  else if (index !== null) {
    const newMenu = [...restaurant.menu];
    newMenu[index][name] = value;
    setRestaurant({ ...restaurant, menu: newMenu });
  }

  // Other fields
  else {
    setRestaurant({ ...restaurant, [name]: value });
  }
};

  const addMenuItem = () => {
    setRestaurant({
      ...restaurant,
     menu: [...restaurant.menu, { name: "", price: "", type: "VEG", image: null }],
    });
  };

  const removeMenuItem = (index) => {
    const newMenu = restaurant.menu.filter((_, i) => i !== index);
    setRestaurant({ ...restaurant, menu: newMenu });
  };

  /* =========================
     SUBMIT → BACKEND
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      const formData = new FormData();

      // Restaurant info
      formData.append("name", restaurant.name);
      formData.append("address", restaurant.address);
      formData.append("cuisine", restaurant.cuisine);
      formData.append("openTime", restaurant.openTime);
      formData.append("closeTime", restaurant.closeTime);

      // Restaurant image
      if (restaurant.image) {
        formData.append("restaurantImage", restaurant.image);
      }

      // menu items
const menuForBackend = restaurant.menu.map(item => ({
  name: item.name,
  price: item.price,
  type: item.type, // ✅ REQUIRED
}));

formData.append("menu", JSON.stringify(menuForBackend));

// menu images
restaurant.menu.forEach(item => {
  if (item.image) formData.append("menuImages", item.image);
});

      const res = await fetch("http://localhost:5000/api/restaurants", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ❗ DO NOT set Content-Type
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create restaurant");
        return;
      }

      alert("Restaurant registered successfully ✅");
      navigate("/RestaurantPending");
    } catch (error) {
      console.error("Restaurant setup error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Register Your Restaurant 🍴</h1>
      </div>

      <div className="profile-section">
        <p>Fill in the details to get your restaurant live on Foodify.</p>

        <form className="profile-form" onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <h2>Basic Info</h2>

          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cuisine</label>
            <select
              name="cuisine"
              value={restaurant.cuisine}
              onChange={handleChange}
              required
            >
              <option value="">Select Cuisine</option>
              <option value="Indian">Indian</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
              <option value="Mexican">Mexican</option>
              <option value="Fast Food">Fast Food</option>
              <option value="South Indian">South Indian</option>
              <option value="Grill,BBQ">Grill,BBQ</option>
              <option value="Bakery">Bakery</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          {/* RESTAURANT IMAGE */}
          <div className="form-group">
            <label>Restaurant Image</label>
            <input
              type="file"
              name="restaurantImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          {/* OPERATING HOURS */}
          <h2>Operating Hours</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Opening Time</label>
              <input
                type="time"
                name="openTime"
                value={restaurant.openTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Closing Time</label>
              <input
                type="time"
                name="closeTime"
                value={restaurant.closeTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* MENU ITEMS */}
          <h2>Menu Items</h2>

          {restaurant.menu.map((item, index) => (
            <div key={index} className="profile-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </div>
              </div>
                 
                <div className="form-group">
                <label>Food Type</label>
                 <select
                   name="type"
                   value={item.type}
                   onChange={(e) => handleChange(e, index)}
                   required
                >
                <option value="VEG">VEG</option>
                <option value="NON_VEG">NON-VEG</option>
                </select>
                </div>


                 
              <div className="form-group">
                <label>Item Image</label>
                <input
                  type="file"
                  name="menuImages" multiple
                  accept="image/*"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>

              {restaurant.menu.length > 1 && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => removeMenuItem(index)}
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-add-address" onClick={addMenuItem}>
            + Add Menu Item
          </button>

          <button type="submit" className="btn-save">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantOwnerSetup;