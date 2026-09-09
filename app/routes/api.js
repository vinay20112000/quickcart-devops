const express = require("express");
const os = require("os");

const router = express.Router();

const {
  products,
  users,
  orders
} = require("../data/store");


// --------------------------------------------------
// HEALTH
// --------------------------------------------------

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "quickcart-api",
    timestamp: new Date().toISOString()
  });
});


// --------------------------------------------------
// CONTAINER / HOST IDENTIFICATION
// --------------------------------------------------

router.get("/container", (req, res) => {
  res.json({
    hostname: os.hostname(),
    pid: process.pid,
    platform: process.platform,
    nodeVersion: process.version
  });
});


// --------------------------------------------------
// PRODUCTS
// --------------------------------------------------

router.get("/products", (req, res) => {
  res.json(products);
});


router.get("/products/:id", (req, res) => {

  const id = Number(req.params.id);

  const product = products.find(
    product => product.id === id
  );

  if (!product) {
    return res.status(404).json({
      error: "Product not found"
    });
  }

  res.json(product);
});


// --------------------------------------------------
// REGISTER
// --------------------------------------------------

router.post("/register", (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Name, email and password are required"
    });
  }

  const existingUser = users.find(
    user => user.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      error: "User already exists"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: "customer"
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

router.post("/login", (req, res) => {

  const {
    email,
    password
  } = req.body;

  const user = users.find(
    user =>
      user.email === email &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials"
    });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});


// --------------------------------------------------
// CREATE ORDER
// --------------------------------------------------

router.post("/orders", (req, res) => {

  const {
    customerName,
    items
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "Order must contain at least one item"
    });
  }

  let total = 0;

  for (const item of items) {

    const product = products.find(
      p => p.id === item.id
    );

    if (!product) {
      return res.status(400).json({
        error: `Product ${item.id} does not exist`
      });
    }

    const quantity = item.quantity || 1;

    total += product.price * quantity;
  }

  const order = {
    id: orders.length + 1001,
    customerName: customerName || "Guest",
    items,
    total,
    status: "PLACED",
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);

  res.status(201).json(order);
});


// --------------------------------------------------
// LIST ORDERS
// --------------------------------------------------

router.get("/orders", (req, res) => {
  res.json(orders);
});


// --------------------------------------------------
// ADMIN
// --------------------------------------------------

router.get("/admin/users", (req, res) => {

  const safeUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }));

  res.json(safeUsers);
});


router.get("/admin/orders", (req, res) => {
  res.json(orders);
});


router.get("/admin/products", (req, res) => {
  res.json(products);
});


module.exports = router;
