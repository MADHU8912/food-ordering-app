const API_URL = "https://food-backend.onrender.com";

async function adminLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const loginMessage = document.getElementById("loginMessage");

  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    loginMessage.textContent = data.message;
    return;
  }

  loginMessage.textContent = data.message;
  loadStats();
}

async function loadStats() {
  const statsDiv = document.getElementById("stats");
  const res = await fetch(`${API_URL}/admin/stats`);
  const data = await res.json();

  statsDiv.innerHTML = `
    <p>Total Users: ${data.totalUsers}</p>
    <p>Total Orders: ${data.totalOrders}</p>
    <p>Active Orders: ${data.activeOrders}</p>
    <p>Paid Payments: ${data.paidPayments}</p>
    <p>Unpaid Payments: ${data.unpaidPayments}</p>
  `;
}

async function updateOrder() {
  const id = document.getElementById("adminOrderId").value;
  const status = document.getElementById("adminOrderStatus").value;
  const paymentStatus = document.getElementById("adminPaymentStatus").value;
  const updateMessage = document.getElementById("updateMessage");

  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status, paymentStatus })
  });

  const data = await res.json();

  if (!res.ok) {
    updateMessage.textContent = data.message || "Update failed";
    return;
  }

  updateMessage.textContent = data.message;
  loadStats();
}

document.getElementById("loginBtn")?.addEventListener("click", adminLogin);
document.getElementById("updateOrderBtn")?.addEventListener("click", updateOrder);