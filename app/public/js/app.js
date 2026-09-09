const products = [
  {
    id: 1,
    name: "Wireless Mouse",
    price: 599,
    oldPrice: 999,
    stock: 23
  },
  {
    id: 2,
    name: "Bluetooth Headphones",
    price: 1299,
    oldPrice: 1999,
    stock: 8
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    price: 1799,
    oldPrice: 2499,
    stock: 15
  },
  {
    id: 4,
    name: "20W Power Bank",
    price: 999,
    oldPrice: 1499,
    stock: 11
  },
  {
    id: 5,
    name: "Smart Watch",
    price: 1999,
    oldPrice: 2999,
    stock: 7
  },
  {
    id: 6,
    name: "USB-C Cable",
    price: 249,
    oldPrice: 399,
    stock: 41
  }
];

function renderProducts() {
  const container = document.getElementById("product-list");

  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <span class="sale-badge">FLASH SALE</span>

      <h3>${product.name}</h3>

      <div>
        <span class="price">₹${product.price}</span>
        <span class="old-price">₹${product.oldPrice}</span>
      </div>

      <p class="stock">
        ${product.stock} items left
      </p>

      <button onclick="addToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  `).join("");
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  let cart = JSON.parse(localStorage.getItem("quickcart-cart") || "[]");

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem("quickcart-cart", JSON.stringify(cart));

  alert(`${product.name} added to cart`);
}

function renderCart() {
  const container = document.getElementById("cart-items");

  if (!container) return;

  const cart = JSON.parse(localStorage.getItem("quickcart-cart") || "[]");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let total = 0;

  container.innerHTML = cart.map(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    return `
      <div class="product-card">
        <h3>${item.name}</h3>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: ₹${subtotal}</p>
      </div>
    `;
  }).join("") + `
    <h2>Total: ₹${total}</h2>
    <button onclick="placeOrder()">Place Order</button>
  `;
}

function placeOrder() {
  const cart = JSON.parse(localStorage.getItem("quickcart-cart") || "[]");

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const orders =
    JSON.parse(localStorage.getItem("quickcart-orders") || "[]");

  const order = {
    id: Date.now(),
    createdAt: new Date().toLocaleString(),
    items: cart,
    status: "PLACED"
  };

  orders.unshift(order);

  localStorage.setItem(
    "quickcart-orders",
    JSON.stringify(orders)
  );

  localStorage.removeItem("quickcart-cart");

  alert("Order placed successfully");

  window.location.href = "/orders";
}

function renderOrders() {
  const container = document.getElementById("order-list");

  if (!container) return;

  const orders =
    JSON.parse(localStorage.getItem("quickcart-orders") || "[]");

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="product-card">
      <h3>Order #${order.id}</h3>
      <p>${order.createdAt}</p>
      <p>Status: <strong>${order.status}</strong></p>
      <p>Items: ${order.items.length}</p>
    </div>
  `).join("");
}

renderProducts();
renderCart();
renderOrders();
