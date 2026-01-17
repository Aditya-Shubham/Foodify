import React from "react";

const RestaurantPending = () => {
  return (
    <div className="pending-container">
      <h2>🎉 Registration Submitted Successfully</h2>

      <p>
        Your restaurant details have been submitted and are currently under review.
      </p>

      <div className="status-badge pending">
        ⏳ Status: Pending Approval
      </div>

      <p className="note">
        Once approved by admin, your restaurant will be visible on the menu page.
      </p>
    </div>
  );
};

export default RestaurantPending;
