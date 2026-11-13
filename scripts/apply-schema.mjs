
import { Client } from "pg";
import { readFile } from "node:fs/promises";

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

        const schema = await readFile(
            "database/schema.sql",
            "utf8"
        );

        await client.query("BEGIN");

        try {
            await client.query(schema);
            await client.query("COMMIT");

            console.log("Database schema created successfully.");
            console.log("Tables: users, suppliers, products");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Schema creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

main();
