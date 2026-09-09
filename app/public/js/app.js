let products = [];


async function loadProducts() {

  try {

    const response = await fetch("/api/products");

    products = await response.json();

    renderProducts();

  } catch (error) {

    console.error(
      "Unable to load products:",
      error
    );

  }

}


function renderProducts() {

  const container =
    document.getElementById("product-list");

  if (!container) return;

  container.innerHTML = products.map(product => `

    <div class="product-card">

      <span class="sale-badge">
        FLASH SALE
      </span>

      <h3>
        ${product.name}
      </h3>

      <p>
        ${product.description}
      </p>

      <div>

        <span class="price">
          ₹${product.price}
        </span>

        <span class="old-price">
          ₹${product.oldPrice}
        </span>

      </div>

      <p class="stock">
        ${product.stock} items left
      </p>

      <button
        onclick="addToCart(${product.id})">

        Add to Cart

      </button>

    </div>

  `).join("");

}


function addToCart(productId) {

  const product = products.find(
    p => p.id === productId
  );

  let cart = JSON.parse(
    localStorage.getItem(
      "quickcart-cart"
    ) || "[]"
  );

  const existing = cart.find(
    item => item.id === productId
  );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  localStorage.setItem(
    "quickcart-cart",
    JSON.stringify(cart)
  );

  alert(
    `${product.name} added to cart`
  );

}


function renderCart() {

  const container =
    document.getElementById("cart-items");

  if (!container) return;

  const cart = JSON.parse(
    localStorage.getItem(
      "quickcart-cart"
    ) || "[]"
  );

  if (cart.length === 0) {

    container.innerHTML =
      "<p>Your cart is empty.</p>";

    return;

  }

  let total = 0;

  container.innerHTML = cart.map(item => {

    const subtotal =
      item.price * item.quantity;

    total += subtotal;

    return `

      <div class="product-card">

        <h3>${item.name}</h3>

        <p>
          Quantity:
          ${item.quantity}
        </p>

        <p>
          Subtotal:
          ₹${subtotal}
        </p>

      </div>

    `;

  }).join("") + `

    <h2>
      Total: ₹${total}
    </h2>

    <button onclick="placeOrder()">
      Place Order
    </button>

  `;

}


async function placeOrder() {

  const cart = JSON.parse(
    localStorage.getItem(
      "quickcart-cart"
    ) || "[]"
  );

  if (cart.length === 0) {

    alert("Cart is empty");

    return;

  }

  try {

    const response = await fetch(
      "/api/orders",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          customerName: "Demo Customer",

          items: cart.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        })
      }
    );

    const order =
      await response.json();

    if (!response.ok) {

      alert(
        order.error ||
        "Order failed"
      );

      return;

    }

    localStorage.removeItem(
      "quickcart-cart"
    );

    alert(
      `Order #${order.id} placed successfully`
    );

    window.location.href =
      "/orders";

  } catch (error) {

    alert(
      "Unable to place order"
    );

  }

}


async function renderOrders() {

  const container =
    document.getElementById("order-list");

  if (!container) return;

  try {

    const response =
      await fetch("/api/orders");

    const orders =
      await response.json();

    if (orders.length === 0) {

      container.innerHTML =
        "<p>No orders yet.</p>";

      return;

    }

    container.innerHTML =
      orders.map(order => `

        <div class="product-card">

          <h3>
            Order #${order.id}
          </h3>

          <p>
            ${new Date(
              order.createdAt
            ).toLocaleString()}
          </p>

          <p>
            Status:
            <strong>
              ${order.status}
            </strong>
          </p>

          <p>
            Total:
            ₹${order.total}
          </p>

        </div>

      `).join("");

  } catch (error) {

    console.error(
      "Unable to load orders:",
      error
    );

  }

}


loadProducts();

renderCart();

renderOrders();
