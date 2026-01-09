
import React from "react";

const Cart = ({ cart, removeFromCart, addToCart }) => {

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
    // 🔥 Flat 40% OFF on first order
    discount = Math.floor(subtotal * 0.4);
  } else {
    // 🔁 Slab-based discounts (existing logic)
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
    localStorage.setItem("hasOrderedBefore", "true");
    alert("🎉 Order placed successfully!");
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
                {/* ➖ ➕ Quantity Control */}
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
             BILL SUMMARY
          =============================== */}
          <div className="cart-total">
            <p>Items: {totalQty}</p>
            <p>SubTotal: ₹{subtotal}</p>
            <p className="discount">Discount: - ₹{discount}</p>
            <h3>Total: ₹{total}</h3>

            <div className="place-order-wrapper">
              <button className="place-order-btn" onClick={placeOrder}>
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
