import "server-only";

import { sql } from "@/app/lib/db";

export interface Product {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    price: string;
    quantity: number;
    supplier_id: string | null;
}

export interface ProductInput {
    name: string;
    description: string | null;
    price: string;
    quantity: number;
    supplierId: string | null;
}

export async function getProducts(userId: string): Promise<Product[]> {
    const products = await sql`
        SELECT
            id,
            user_id,
            name,
            description,
            price,
            quantity,
            supplier_id
        FROM products
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;

    return products as Product[];
}

export async function getProductById(
    productId: string,
    userId: string
): Promise<Product | null> {
    const products = await sql`
        SELECT
            id,
            user_id,
            name,
            description,
            price,
            quantity,
            supplier_id
        FROM products
        WHERE id = ${productId}
          AND user_id = ${userId}
        LIMIT 1
    `;

    return (products[0] as Product) || null;
}

export async function createProduct(
    userId: string,
    data: ProductInput
): Promise<Product> {
    const products = await sql`
        INSERT INTO products (
            user_id,
            name,
            description,
            price,
            quantity,
            supplier_id
        )
        VALUES (
            ${userId},
            ${data.name},
            ${data.description},
            ${data.price},
            ${data.quantity},
            ${data.supplierId}
        )
        RETURNING
            id,
            user_id,
            name,
            description,
            price,
            quantity,
            supplier_id
    `;

    return products[0] as Product;
}

export async function updateProduct(
    productId: string,
    userId: string,
    data: ProductInput
): Promise<Product | null> {
    const products = await sql`
        UPDATE products
        SET
            name = ${data.name},
            description = ${data.description},
            price = ${data.price},
            quantity = ${data.quantity},
            supplier_id = ${data.supplierId},
            updated_at = NOW()
        WHERE id = ${productId}
          AND user_id = ${userId}
        RETURNING
            id,
            user_id,
            name,
            description,
            price,
            quantity,
            supplier_id
    `;

    return (products[0] as Product) || null;
}

export async function deleteProduct(
    productId: string,
    userId: string
): Promise<boolean> {
    const products = await sql`
        DELETE FROM products
        WHERE id = ${productId}
          AND user_id = ${userId}
        RETURNING id
    `;

    return products.length > 0;
}
