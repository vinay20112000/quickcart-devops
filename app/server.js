const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

function page(file) {
  return path.join(__dirname, "public", file);
}

app.get("/", (req, res) => {
  res.sendFile(page("index.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(page("products.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(page("cart.html"));
});

app.get("/orders", (req, res) => {
  res.sendFile(page("orders.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(page("login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(page("register.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(page("admin/dashboard.html"));
});

app.get("/admin/login", (req, res) => {
  res.sendFile(page("admin/login.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`QuickCart running on port ${PORT}`);
});
