import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  // Group items by id to calculate quantity
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

  // Calculate total
  const total = itemsArray.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Your Cart</h2>
        <p>Add items to place an order</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">🛒 Your cart is empty</div>
      ) : (
        <div className="cart-card"> {/* Single card for all items */}
          <h3>Selected Items</h3>
          {itemsArray.map((item) => (
  <div key={item.id} className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
    <div style={{ flex: 2 }}>
      <strong>{item.name}</strong> ({item.type === "veg" ? "🟢 Veg" : "🔴 Non-Veg"})
    </div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      ₹{item.price} × {item.quantity} = ₹{item.totalPrice}
    </div>
    <div style={{ flex: 0 }}>
      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
    </div>
  </div>
))}

        

          <div className="cart-total">
            <h3>Total: ₹{total}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;



