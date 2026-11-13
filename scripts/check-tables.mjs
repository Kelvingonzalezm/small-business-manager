
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
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        console.log("Tables in the public schema:");

        if (result.rows.length === 0) {
            console.log("No tables found.");
        } else {
            console.table(result.rows);
        }
    } catch (error) {
        console.error("Database check failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

main();
