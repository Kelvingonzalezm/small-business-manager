
import "server-only";

import { sql } from "@/app/lib/db";

export interface Supplier {
    id: string;
    user_id: string;
    name: string;
    email: string | null;
    phone: string | null;
}

export interface SupplierInput {
    name: string;
    email: string | null;
    phone: string | null;
}

export async function getSuppliers(userId: string): Promise<Supplier[]> {
    const suppliers = await sql`
        SELECT
            id,
            user_id,
            name,
            email,
            phone
        FROM suppliers
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
    `;

    return suppliers as Supplier[];
}

export async function getSupplierById(
    supplierId: string,
    userId: string
): Promise<Supplier | null> {
    const suppliers = await sql`
        SELECT
            id,
            user_id,
            name,
            email,
            phone
        FROM suppliers
        WHERE id = ${supplierId}
          AND user_id = ${userId}
        LIMIT 1
    `;

    return (suppliers[0] as Supplier) || null;
}

export async function createSupplier(
    userId: string,
    data: SupplierInput
): Promise<Supplier> {
    const suppliers = await sql`
        INSERT INTO suppliers (
            user_id,
            name,
            email,
            phone
        )
        VALUES (
            ${userId},
            ${data.name},
            ${data.email},
            ${data.phone}
        )
        RETURNING
            id,
            user_id,
            name,
            email,
            phone
    `;

    return suppliers[0] as Supplier;
}

export async function updateSupplier(
    supplierId: string,
    userId: string,
    data: SupplierInput
): Promise<Supplier | null> {
    const suppliers = await sql`
        UPDATE suppliers
        SET
            name = ${data.name},
            email = ${data.email},
            phone = ${data.phone},
            updated_at = NOW()
        WHERE id = ${supplierId}
          AND user_id = ${userId}
        RETURNING
            id,
            user_id,
            name,
            email,
            phone
    `;

    return (suppliers[0] as Supplier) || null;
}

export async function deleteSupplier(
    supplierId: string,
    userId: string
): Promise<boolean> {
    const suppliers = await sql`
        DELETE FROM suppliers
        WHERE id = ${supplierId}
          AND user_id = ${userId}
        RETURNING id
    `;

    return suppliers.length > 0;
}
