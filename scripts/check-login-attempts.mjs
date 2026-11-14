
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
            SELECT COUNT(*)::int AS total
            FROM login_attempts;
        `);

        console.log(
            "Remaining failed login attempts:",
            result.rows[0].total
        );
    } catch (error) {
        console.error("Login attempts check failed:", error.message);
        process.exitCode = 1;
    } finally {
        await client.end();
    }
}

main();
