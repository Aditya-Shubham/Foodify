import React from "react";

const DeliveryPartnerPending = () => {
  return (
    <div className="pending-container">
      <h2>🎉 Registration Submitted Successfully</h2>

      <p>
        Your details have been submitted and are currently under review.
      </p>

      <div className="status-badge pending">
        ⏳ Status: Pending Approval
      </div>

      <p className="note">
        Once approved by admin, your will become a delivery partner.
      </p>
    </div>
  );
};

export default DeliveryPartnerPending;
