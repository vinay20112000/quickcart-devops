const express = require("express");
const path = require("path");

const apiRoutes = require("./routes/api");

const app = express();

const PORT = process.env.PORT || 3000;


// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


// --------------------------------------------------
// API
// --------------------------------------------------

app.use("/api", apiRoutes);


// --------------------------------------------------
// STATIC WEBSITE
// --------------------------------------------------

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


function page(file) {
  return path.join(
    __dirname,
    "public",
    file
  );
}


// --------------------------------------------------
// CUSTOMER ROUTES
// --------------------------------------------------

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


// --------------------------------------------------
// ADMIN ROUTES
// --------------------------------------------------

app.get("/admin", (req, res) => {
  res.sendFile(
    page("admin/dashboard.html")
  );
});


app.get("/admin/login", (req, res) => {
  res.sendFile(
    page("admin/login.html")
  );
});


// --------------------------------------------------
// UNKNOWN API ROUTE
// --------------------------------------------------

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found"
  });
});


// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `QuickCart running on port ${PORT}`
    );

  }
);
