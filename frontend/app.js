const API_URL = "http://localhost:5000";
let cart = [];

async function loadMenu() {
  const menuDiv = document.getElementById("menu");
  if (!menuDiv) return;

  const res = await fetch(`${API_URL}/menu`);
  const items = await res.json();

  menuDiv.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>Category: ${item.category}</p>
      <p>Price: ₹${item.price}</p>
      <button>Add to Cart</button>
    `;
    div.querySelector("button").addEventListener("click", () => addToCart(item));
    menuDiv.appendChild(div);
  });
}

function addToCart(item) {
  cart.push(item);
  renderCart();
}

function renderCart() {
  const cartEl = document.getElementById("cart");
  cartEl.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    cartEl.appendChild(li);
  });
}

async function placeOrder() {
  const orderMessage = document.getElementById("orderMessage");

  if (cart.length === 0) {
    orderMessage.textContent = "Cart is empty";
    return;
  }

  const res = await fetch(`${API_URL}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customerName: "Guest",
      items: cart
    })
  });

  const data = await res.json();
  orderMessage.textContent = `${data.message}. Your order ID is ${data.order.id}`;
  cart = [];
  renderCart();
}

async function trackOrder() {
  const orderId = document.getElementById("trackOrderId").value;
  const result = document.getElementById("trackResult");

  if (!orderId) {
    result.textContent = "Please enter order ID";
    return;
  }

  const res = await fetch(`${API_URL}/orders/${orderId}`);
  const data = await res.json();

  if (!res.ok) {
    result.textContent = data.message || "Order not found";
    return;
  }

  result.textContent = JSON.stringify(data, null, 2);
}

document.getElementById("placeOrderBtn")?.addEventListener("click", placeOrder);
document.getElementById("trackBtn")?.addEventListener("click", trackOrder);

loadMenu();