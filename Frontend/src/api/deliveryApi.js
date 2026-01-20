const API_URL = "http://localhost:5000/api/orders"; // Orders backend

// ✅ Get all available orders for delivery partner
export const getAvailableOrders = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/delivery/available`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

// ✅ Accept an order
export const acceptOrder = async (orderId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/delivery/accept/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to accept order");
  return res.json();
};

// ✅ Update order status
export const updateOrderStatus = async (orderId, status) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/delivery/status/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
};
