import React, { useState } from "react";

const TopBar = () => {
  const [isVeg, setIsVeg] = useState(true);

  return (
    <div className="topbar">
      <input
        type="text"
        placeholder="Search food or restaurant"
        className="search-input"
      />

      <div
        className={`swiggy-toggle ${isVeg ? "veg" : "nonveg"}`}
        onClick={() => setIsVeg(!isVeg)}
      >
        <span className="label veg-label">VEG</span>
        <span className="label nonveg-label">NON-VEG</span>
        <div className="thumb"></div>
      </div>
    </div>
  );
};

export default TopBar;
