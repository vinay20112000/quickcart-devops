USE quickcart;


-- --------------------------------------------------
-- DEMO USERS
-- --------------------------------------------------

INSERT INTO users (
    name,
    email,
    password,
    role
)
VALUES
(
    'Demo User',
    'demo@quickcart.local',
    'demo123',
    'customer'
),
(
    'QuickCart Admin',
    'admin@quickcart.local',
    'admin123',
    'admin'
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    role = VALUES(role);


-- --------------------------------------------------
-- PRODUCTS
-- --------------------------------------------------

INSERT INTO products (
    id,
    name,
    description,
    price,
    old_price,
    stock,
    flash_sale
)
VALUES
(
    1,
    'Wireless Mouse',
    '2.4GHz ergonomic wireless mouse',
    599,
    999,
    23,
    TRUE
),
(
    2,
    'Bluetooth Headphones',
    'Wireless over-ear headphones',
    1299,
    1999,
    8,
    TRUE
),
(
    3,
    'Mechanical Keyboard',
    'Compact mechanical keyboard',
    1799,
    2499,
    15,
    TRUE
),
(
    4,
    '20W Power Bank',
    'Fast charging portable power bank',
    999,
    1499,
    11,
    TRUE
),
(
    5,
    'Smart Watch',
    'Fitness tracking smart watch',
    1999,
    2999,
    7,
    TRUE
),
(
    6,
    'USB-C Cable',
    '1 meter fast charging USB-C cable',
    249,
    399,
    41,
    TRUE
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    old_price = VALUES(old_price),
    stock = VALUES(stock),
    flash_sale = VALUES(flash_sale);
