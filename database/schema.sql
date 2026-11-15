
-- Small Business Manager
-- Initial PostgreSQL database schema

-- 1. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email addresses must be unique, regardless of letter case.
CREATE UNIQUE INDEX users_email_unique
ON users (LOWER(email));

-- 2. Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT supplier_name_not_empty
        CHECK (LENGTH(TRIM(name)) > 0),

    CONSTRAINT supplier_contact_required
        CHECK (email IS NOT NULL OR phone IS NOT NULL),

    CONSTRAINT suppliers_id_user_unique
        UNIQUE (id, user_id)
);

-- 3. Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    supplier_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT product_name_not_empty
        CHECK (LENGTH(TRIM(name)) > 0),

    CONSTRAINT product_price_non_negative
        CHECK (price >= 0),

    CONSTRAINT product_quantity_non_negative
        CHECK (quantity >= 0),

    CONSTRAINT products_supplier_same_user
        FOREIGN KEY (supplier_id, user_id)
        REFERENCES suppliers (id, user_id)
        ON DELETE SET NULL (supplier_id)
);

-- Indexes for common user-specific queries.
CREATE INDEX products_user_id_idx ON products(user_id);
CREATE INDEX suppliers_user_id_idx ON suppliers(user_id);
CREATE INDEX products_supplier_id_idx ON products(supplier_id);
