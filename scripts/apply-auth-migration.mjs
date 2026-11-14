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

        const migration = await readFile(
            "database/auth-migration.sql",
            "utf8"
        );

        await client.query("BEGIN");

        try {
            await client.query(migration);
            await client.query("COMMIT");

            console.log("Authentication migration applied successfully.");
            console.log("Table created: sessions");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Authentication migration failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

main();