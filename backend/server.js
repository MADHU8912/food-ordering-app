const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let menu = [
  { id: 1, name: "Burger", category: "Fast Food", price: 120 },
  { id: 2, name: "Pizza", category: "Fast Food", price: 250 },
  { id: 3, name: "Biryani", category: "Main Course", price: 180 },
  { id: 4, name: "Coke", category: "Drinks", price: 40 },
  { id: 5, name: "Combo Deal", category: "Offers", price: 299 }
];

let users = [
  { id: 1, name: "User1" },
  { id: 2, name: "User2" }
];

let orders = [];

const admin = {
  username: "food",
  password: "admin123"
};

app.get("/", (req, res) => {
  res.send("Food backend is running");
});

app.get("/menu", (req, res) => {
  res.json(menu);
});

app.post("/order", (req, res) => {
  const { items, customerName } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const order = {
    id: orders.length + 1,
    customerName: customerName || "Guest",
    items,
    status: "Order Placed",
    paymentStatus: "Unpaid",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  res.status(201).json({ message: "Order placed successfully", order });
});

app.get("/orders", (req, res) => {
  res.json(orders);
});

app.get("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

app.put("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status, paymentStatus } = req.body;

  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  res.json({ message: "Order updated successfully", order });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid username or password" });
});

app.post("/menu", (req, res) => {
  const { name, category, price } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const item = {
    id: menu.length + 1,
    name,
    category,
    price
  };

  menu.push(item);
  res.status(201).json({ message: "Menu item added", item });
});

app.put("/menu/:id", (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = menu.find(m => m.id === itemId);

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  const { name, category, price } = req.body;

  if (name) item.name = name;
  if (category) item.category = category;
  if (price) item.price = price;

  res.json({ message: "Menu item updated", item });
});

app.get("/admin/stats", (req, res) => {
  res.json({
    totalUsers: users.length,
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== "Delivered").length,
    paidPayments: orders.filter(o => o.paymentStatus === "Paid").length,
    unpaidPayments: orders.filter(o => o.paymentStatus === "Unpaid").length
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});