const express = require("express");
const os = require("os");

const pool = require("../config/db");

const router = express.Router();


// --------------------------------------------------
// HEALTH
// --------------------------------------------------

router.get("/health", async (req, res) => {

  try {

    await pool.query("SELECT 1");

    res.status(200).json({
      status: "UP",
      service: "quickcart-api",
      database: "UP",
      timestamp: new Date().toISOString()
    });

  } catch (error) {

    res.status(503).json({
      status: "DEGRADED",
      service: "quickcart-api",
      database: "DOWN",
      timestamp: new Date().toISOString()
    });

  }

});


// --------------------------------------------------
// CONTAINER / HOST INFORMATION
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

router.get("/products", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        old_price AS oldPrice,
        stock,
        flash_sale AS flashSale
      FROM products
      WHERE active = TRUE
      ORDER BY id
    `);

    res.json(rows);

  } catch (error) {

    console.error(
      "Products query failed:",
      error.message
    );

    res.status(500).json({
      error: "Unable to retrieve products"
    });

  }

});


router.get("/products/:id", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        old_price AS oldPrice,
        stock,
        flash_sale AS flashSale
      FROM products
      WHERE id = ?
        AND active = TRUE
    `, [
      Number(req.params.id)
    ]);

    if (rows.length === 0) {

      return res.status(404).json({
        error: "Product not found"
      });

    }

    res.json(rows[0]);

  } catch (error) {

    res.status(500).json({
      error: "Unable to retrieve product"
    });

  }

});


// --------------------------------------------------
// REGISTER
// --------------------------------------------------

router.post("/register", async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;

  if (!name || !email || !password) {

    return res.status(400).json({
      error:
        "Name, email and password are required"
    });

  }

  try {

    const [result] = await pool.query(`
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, 'customer')
    `, [
      name,
      email,
      password
    ]);

    res.status(201).json({
      message:
        "User registered successfully",

      user: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (error) {

    if (error.code === "ER_DUP_ENTRY") {

      return res.status(409).json({
        error: "User already exists"
      });

    }

    console.error(
      "Registration failed:",
      error.message
    );

    res.status(500).json({
      error: "Registration failed"
    });

  }

});


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

router.post("/login", async (req, res) => {

  const {
    email,
    password
  } = req.body;

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        email,
        role
      FROM users
      WHERE email = ?
        AND password = ?
      LIMIT 1
    `, [
      email,
      password
    ]);

    if (rows.length === 0) {

      return res.status(401).json({
        error: "Invalid credentials"
      });

    }

    res.json({
      message: "Login successful",
      user: rows[0]
    });

  } catch (error) {

    res.status(500).json({
      error: "Login failed"
    });

  }

});


// --------------------------------------------------
// CREATE ORDER
// --------------------------------------------------

router.post("/orders", async (req, res) => {

  const {
    customerName,
    userId,
    items
  } = req.body;

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {

    return res.status(400).json({
      error:
        "Order must contain at least one item"
    });

  }

  const connection =
    await pool.getConnection();

  try {

    await connection.beginTransaction();

    let total = 0;

    const orderItems = [];

    for (const item of items) {

      const quantity =
        Number(item.quantity || 1);

      if (quantity <= 0) {

        throw new Error(
          "Invalid quantity"
        );

      }

      const [products] =
        await connection.query(`
          SELECT
            id,
            name,
            price,
            stock
          FROM products
          WHERE id = ?
            AND active = TRUE
          FOR UPDATE
        `, [
          Number(item.id)
        ]);

      if (products.length === 0) {

        const error =
          new Error(
            `Product ${item.id} does not exist`
          );

        error.statusCode = 400;

        throw error;
      }

      const product =
        products[0];

      if (product.stock < quantity) {

        const error =
          new Error(
            `Insufficient stock for ${product.name}`
          );

        error.statusCode = 409;

        throw error;
      }

      const price =
        Number(product.price);

      const subtotal =
        price * quantity;

      total += subtotal;

      orderItems.push({
        productId: product.id,
        quantity,
        price,
        subtotal
      });

      await connection.query(`
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
      `, [
        quantity,
        product.id
      ]);

    }


    const [orderResult] =
      await connection.query(`
        INSERT INTO orders (
          user_id,
          customer_name,
          total_amount,
          status
        )
        VALUES (?, ?, ?, 'PLACED')
      `, [
        userId || null,
        customerName || "Guest",
        total
      ]);


    const orderId =
      orderResult.insertId;


    for (const item of orderItems) {

      await connection.query(`
        INSERT INTO order_items (
          order_id,
          product_id,
          quantity,
          unit_price,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
      `, [
        orderId,
        item.productId,
        item.quantity,
        item.price,
        item.subtotal
      ]);

    }


    await connection.commit();


    res.status(201).json({
      id: orderId,
      customerName:
        customerName || "Guest",
      total,
      status: "PLACED",
      items: orderItems,
      createdAt:
        new Date().toISOString()
    });


  } catch (error) {

    await connection.rollback();

    console.error(
      "Order creation failed:",
      error.message
    );

    res.status(
      error.statusCode || 500
    ).json({
      error:
        error.message ||
        "Order creation failed"
    });

  } finally {

    connection.release();

  }

});


// --------------------------------------------------
// ORDERS
// --------------------------------------------------

router.get("/orders", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        user_id AS userId,
        customer_name AS customerName,
        total_amount AS total,
        status,
        created_at AS createdAt
      FROM orders
      ORDER BY created_at DESC
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: "Unable to retrieve orders"
    });

  }

});


// --------------------------------------------------
// ADMIN USERS
// --------------------------------------------------

router.get("/admin/users", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        email,
        role,
        created_at AS createdAt
      FROM users
      ORDER BY id
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: "Unable to retrieve users"
    });

  }

});


// --------------------------------------------------
// ADMIN ORDERS
// --------------------------------------------------

router.get("/admin/orders", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        user_id AS userId,
        customer_name AS customerName,
        total_amount AS total,
        status,
        created_at AS createdAt
      FROM orders
      ORDER BY created_at DESC
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: "Unable to retrieve orders"
    });

  }

});


// --------------------------------------------------
// ADMIN PRODUCTS
// --------------------------------------------------

router.get("/admin/products", async (req, res) => {

  try {

    const [rows] = await pool.query(`
      SELECT
        id,
        name,
        description,
        price,
        old_price AS oldPrice,
        stock,
        flash_sale AS flashSale,
        active
      FROM products
      ORDER BY id
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error: "Unable to retrieve products"
    });

  }

});


module.exports = router;
