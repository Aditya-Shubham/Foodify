import axios from "axios";
import React from "react";

const Cart = ({ cart, removeFromCart, addToCart }) => {
  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [upiId, setUpiId] = React.useState("");
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [upiVerified, setUpiVerified] = React.useState(false);
  const [verifying, setVerifying] = React.useState(false);

  // TOTAL QTY & SUBTOTAL
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // FEES
  const platformFee = 10;
  const deliveryFee = 30;

  // FIRST ORDER CHECK
  const isFirstOrder = !localStorage.getItem("hasOrderedBefore");

  // DISCOUNT LOGIC
  let discount = 0;
  if (isFirstOrder) discount = Math.floor(subtotal * 0.4);
  else if (subtotal >= 800 && totalQty >= 8) discount = 250;
  else if (subtotal >= 500 && totalQty >= 5) discount = 150;
  else if (subtotal >= 300 && totalQty >= 3) discount = 100;
  else if (subtotal >= 200 && totalQty >= 2) discount = 50;

  // GST CALCULATION
  const foodGst = subtotal * 0.05;
  const deliveryGst = deliveryFee * 0.18;
  const platformGst = platformFee * 0.18;

  const gst = Math.floor(foodGst + deliveryGst + platformGst);

  // TOTAL
  const total =
    Math.max(subtotal - discount, 0) +
    platformFee +
    deliveryFee +
    gst;

  // PLACE ORDER
  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("⚠️ Your cart is empty");
      return;
    }

    if (paymentMethod === "upi" && !upiVerified) {
      alert("⚠️ Verify UPI first");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const restaurantId = cart[0]?.restaurantId;
      if (!restaurantId) {
        alert("⚠️ Restaurant ID missing for order");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        {
          restaurant: restaurantId,
          items: cart.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price
          })),
          subtotal,
          discount,
          platformFee,
          deliveryFee,
          gst,
          totalAmount: total,
          paymentMethod
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order saved:", res.data);

      alert("🎉 Order placed!");
      setOrderPlaced(true);
      localStorage.setItem("hasOrderedBefore", "true");

    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      alert("❌ Order failed");
    }
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

          {cart.map((item, index) => (
            <div
              key={index}
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
                  <span
                    className={`food-type ${
                      item.type === "VEG" ? "veg" : "nonveg"
                    }`}
                  >
                    {item.type === "VEG" ? "🟢 Veg" : "🔴 Non-Veg"}
                  </span>
                </p>
              </div>

              <div style={{ flex: 1 }}>
                <div className="qty-control">
                  <button onClick={() => removeFromCart(item)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => addToCart(item, item.restaurantId)}>
                    +
                  </button>
                </div>
              </div>

              <div style={{ flex: 0 }}>
                <p>₹{item.price * item.qty}</p>
              </div>
            </div>
          ))}

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

            {paymentMethod === "upi" && (
              <div className="upi-box">
                <input
                  type="text"
                  placeholder="Enter UPI ID"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    setUpiVerified(false);
                  }}
                />

                <button
                  disabled={upiId.trim() === "" || verifying}
                  onClick={() => {
                    setVerifying(true);
                    setTimeout(() => {
                      setUpiVerified(true);
                      setVerifying(false);
                      alert("✅ UPI ID verified");
                    }, 1000);
                  }}
                >
                  {verifying
                    ? "Verifying..."
                    : upiVerified
                    ? "Verified"
                    : "Verify"}
                </button>
              </div>
            )}
          </div>

          <div className="cart-total">
            <p>Items: {totalQty}</p>
            <p>Item Total: ₹{subtotal}</p>

            <p className="discount">Discount: - ₹{discount}</p>

            <p>Delivery Fee: ₹{deliveryFee}</p>

            <p>Platform Fee: ₹{platformFee}</p>

            <p>GST & Charges: ₹{gst}</p>

            <h3>Total: ₹{total}</h3>

            <div className="place-order-wrapper">
              <button
                className="place-order-btn"
                onClick={placeOrder}
                disabled={
                  orderPlaced || (paymentMethod === "upi" && !upiVerified)
                }
              >
                {orderPlaced ? "ORDER PLACED" : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;