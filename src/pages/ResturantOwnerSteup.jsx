import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const RestaurantOwnerSetup = () => {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState({
    name: "",
    cuisine: "",
    openTime: "",
    closeTime: "",
    image: null,
    menu: [{ name: "", price: "", image: null }]
  });

  const handleChange = (e, index = null) => {
    const { name, value, files } = e.target;

    if (name === "image" && index === null) {
      setRestaurant({ ...restaurant, image: files[0] });
    } else if (name === "image" && index !== null) {
      const newMenu = [...restaurant.menu];
      newMenu[index].image = files[0];
      setRestaurant({ ...restaurant, menu: newMenu });
    } else if (index !== null) {
      const newMenu = [...restaurant.menu];
      newMenu[index][name] = value;
      setRestaurant({ ...restaurant, menu: newMenu });
    } else {
      setRestaurant({ ...restaurant, [name]: value });
    }
  };

  const addMenuItem = () => {
    setRestaurant({
      ...restaurant,
      menu: [...restaurant.menu, { name: "", price: "", image: null }]
    });
  };

  const removeMenuItem = (index) => {
    const newMenu = restaurant.menu.filter((_, i) => i !== index);
    setRestaurant({ ...restaurant, menu: newMenu });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Restaurant data:", restaurant);
    navigate("/home"); // TEMP: redirect after setup
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Register Your Restaurant 🍴</h1>
      </div>

      <div className="profile-section">
        <p>Fill in the details to get your restaurant live on Foodify.</p>
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <h2>Basic Info</h2>
          <div className="form-group">
            <label>Restaurant Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter restaurant name"
              value={restaurant.name}
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
            </select>
          </div>

          {/* Timings */}
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

         

          {/* Menu Items */}
          <h2>Menu Items</h2>
          {restaurant.menu.map((item, index) => (
            <div key={index} className="profile-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter item name"
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
                    placeholder="Enter price"
                    value={item.price}
                    onChange={(e) => handleChange(e, index)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => handleChange(e, index)}
                  accept="image/*"
                />
              </div>
              {restaurant.menu.length > 1 && (
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => removeMenuItem(index)}
                  >
                    Remove Item
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            className="btn-add-address"
            onClick={addMenuItem}
          >
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

