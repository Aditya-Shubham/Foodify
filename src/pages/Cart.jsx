import React from "react";

const Cart = ({ cart, removeFromCart, addToCart }) => {
  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [upiId, setUpiId] = React.useState("");
  const [orderPlaced, setOrderPlaced] = React.useState(false);

  // 🔥 NEW STATES
  const [upiVerified, setUpiVerified] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  /* ===============================
     GROUP ITEMS BY ID
  =============================== */
  const groupedItems = cart.reduce((acc, item) => {
    if (acc[item.id]) {
      acc[item.id].quantity += 1;
      acc[item.id].totalPrice += item.price;
    } else {
      acc[item.id] = { ...item, quantity: 1, totalPrice: item.price };
    }
    return acc;
  }, {});

  const itemsArray = Object.values(groupedItems);

  /* ===============================
     TOTAL QTY & SUBTOTAL
  =============================== */
  const totalQty = itemsArray.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = itemsArray.reduce((sum, i) => sum + i.totalPrice, 0);

  /* ===============================
     FIRST ORDER CHECK
  =============================== */
  const isFirstOrder = !localStorage.getItem("hasOrderedBefore");

  /* ===============================
     DISCOUNT LOGIC
  =============================== */
  let discount = 0;

  if (isFirstOrder) {
    discount = Math.floor(subtotal * 0.4);
  } else {
    if (subtotal >= 800 && totalQty >= 8) discount = 250;
    else if (subtotal >= 500 && totalQty >= 5) discount = 150;
    else if (subtotal >= 300 && totalQty >= 3) discount = 100;
    else if (subtotal >= 200 && totalQty >= 2) discount = 50;
  }

  const total = Math.max(subtotal - discount, 0);

  /* ===============================
     PLACE ORDER HANDLER
  =============================== */
  const placeOrder = () => {
    if (paymentMethod === "upi" && !upiVerified) {
      alert("⚠️ Please verify your UPI ID first");
      return;
    }

    localStorage.setItem("hasOrderedBefore", "true");

    alert(
      paymentMethod === "cod"
        ? "🎉 Order placed successfully!"
        : "🎉 Order placed successfully!"

    );

    setOrderPlaced(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Your Cart</h2>
        <p>Add items to place an order</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">🛒 Your cart is empty</div>
      ) : (
        <div className="cart-card">
          <h3>Selected Items</h3>

          {isFirstOrder && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              🎉 First Order Offer: Flat 40% OFF
            </p>
          )}

          {itemsArray.map((item) => (
            <div
              key={item.id}
              className="cart-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px"
              }}
            >
              <div style={{ flex: 2 }}>
                <p>
                  <strong>{item.name}</strong>{" "}
                  ({item.type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"})
                </p>
              </div>

              <div style={{ flex: 1 }}>
                <div className="qty-control">
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        type: item.type
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ flex: 0 }}>
                <p>₹{item.totalPrice}</p>
              </div>
            </div>
          ))}

          {/* ===============================
             PAYMENT METHOD
          =============================== */}
          <div className="payment-box">
            <h3>Payment Method</h3>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI
            </label>

            {/* 🔥 UPI INPUT + VERIFY */}
            {paymentMethod === "upi" && (
              <div className="upi-box">
                <input
                  type="text"
                  className="upi-input"
                  placeholder="Enter UPI ID (eg: name@upi)"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiVerified(false);
                  }}
                />

                <button
                  className="verify-upi-btn"
                  disabled={upiId.trim() === "" || verifying}
                  onClick={() => {
                    setVerifying(true);
                    setTimeout(() => {
                      setUpiVerified(true);
                      setVerifying(false);
                      alert("✅ UPI ID verified successfully");
                    }, 1000);
                  }}
                >
                  {verifying
                    ? "Verifying..."
                    : upiVerified
                    ? "Verified "
                    : "Verify "}
                </button>
              </div>
            )}
          </div>

          {/* ===============================
             BILL SUMMARY
          =============================== */}
          <div className="cart-total">
            <p>Items: {totalQty}</p>
            <p>SubTotal: ₹{subtotal}</p>
            <p className="discount">Discount: - ₹{discount}</p>
            <h3>Total: ₹{total}</h3>

            <div className="place-order-wrapper">
              <button
                className="place-order-btn"
                onClick={placeOrder}
                disabled={
                  orderPlaced ||
                  (paymentMethod === "upi" && !upiVerified)
                }
              >
                {orderPlaced ? "ORDER PLACED " : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
