
import { sql } from "../../lib/db";

export async function GET() {
    try {
        const result = await sql`
            SELECT
                current_user AS database_user,
                current_database() AS database_name,
                current_schema() AS schema_name,
                has_schema_privilege(
                    current_user,
                    'public',
                    'CREATE'
                ) AS can_create_tables,
                current_setting('server_version') AS server_version
        `;

        return Response.json({
            success: true,
            message: "Connected to Neon PostgreSQL",
            databaseUser: result[0].database_user,
            databaseName: result[0].database_name,
            schemaName: result[0].schema_name,
            canCreateTables: result[0].can_create_tables,
            serverVersion: result[0].server_version,
        });
    } catch (error) {
        console.error("Database connection error:", error);

        return Response.json(
            {
                success: false,
                message: "Database connection failed",
            },
            { status: 500 }
        );
    }
}
