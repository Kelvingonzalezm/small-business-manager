
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function main() {
    try {
        await client.connect();

        const result = await client.query(`
            SELECT
                conname AS constraint_name,
                CASE contype
                    WHEN 'p' THEN 'PRIMARY KEY'
                    WHEN 'f' THEN 'FOREIGN KEY'
                END AS constraint_type,
                pg_get_constraintdef(oid) AS definition
            FROM pg_constraint
            WHERE conrelid = 'public.products'::regclass
              AND contype IN ('p', 'f')
            ORDER BY contype, conname;
        `);

        console.log("Products table constraints:");
        console.table(result.rows);
    } catch (error) {
        console.error("Verification failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

main();
