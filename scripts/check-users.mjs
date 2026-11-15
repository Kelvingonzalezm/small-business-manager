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
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'users'
            ORDER BY ordinal_position;
        `);

        console.log("Users table structure:");
        console.table(result.rows);

        const indexes = await client.query(`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
              AND tablename = 'users';
        `);

        console.log("Users table indexes:");
        console.table(indexes.rows);
    } catch (error) {
        console.error("Users table check failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

main();