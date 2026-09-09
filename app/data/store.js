const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    description: "2.4GHz ergonomic wireless mouse",
    price: 599,
    oldPrice: 999,
    stock: 23,
    flashSale: true
  },
  {
    id: 2,
    name: "Bluetooth Headphones",
    description: "Wireless over-ear headphones",
    price: 1299,
    oldPrice: 1999,
    stock: 8,
    flashSale: true
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    description: "Compact mechanical keyboard",
    price: 1799,
    oldPrice: 2499,
    stock: 15,
    flashSale: true
  },
  {
    id: 4,
    name: "20W Power Bank",
    description: "Fast charging portable power bank",
    price: 999,
    oldPrice: 1499,
    stock: 11,
    flashSale: true
  },
  {
    id: 5,
    name: "Smart Watch",
    description: "Fitness tracking smart watch",
    price: 1999,
    oldPrice: 2999,
    stock: 7,
    flashSale: true
  },
  {
    id: 6,
    name: "USB-C Cable",
    description: "1 meter fast charging USB-C cable",
    price: 249,
    oldPrice: 399,
    stock: 41,
    flashSale: true
  }
];

const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@quickcart.local",
    password: "demo123",
    role: "customer"
  },
  {
    id: 2,
    name: "QuickCart Admin",
    email: "admin@quickcart.local",
    password: "admin123",
    role: "admin"
  }
];

const orders = [];

module.exports = {
  products,
  users,
  orders
};
