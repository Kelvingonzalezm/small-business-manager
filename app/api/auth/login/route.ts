
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import {
    createSession,
    verifyPassword,
} from "@/app/lib/auth";

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_WINDOW_MINUTES = 15;

export async function POST(request: Request) {
    try {
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid request body." },
                { status: 400 }
            );
        }

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return NextResponse.json(
                { error: "Invalid request body." },
                { status: 400 }
            );
        }

        const data = body as Record<string, unknown>;

        const email =
            typeof data.email === "string"
                ? data.email.trim().toLowerCase()
                : "";
        const password =
            typeof data.password === "string" ? data.password : "";

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.length > 254 || !emailPattern.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const recentAttempts = await sql`
            SELECT COUNT(*)::int AS count
            FROM login_attempts
            WHERE email = ${email}
              AND attempted_at > NOW() - (
                  ${LOGIN_ATTEMPT_WINDOW_MINUTES} * INTERVAL '1 minute'
              )
        `;

        const attemptCount = Number(recentAttempts[0].count);

        if (attemptCount >= MAX_LOGIN_ATTEMPTS) {
            return NextResponse.json(
                {
                    error: "Too many login attempts. Please try again in 15 minutes.",
                },
                { status: 429 }
            );
        }

        const users = await sql`
            SELECT id, name, email, password_hash
            FROM users
            WHERE LOWER(email) = ${email}
            LIMIT 1
        `;

        if (users.length === 0) {
            await sql`
                INSERT INTO login_attempts (email)
                VALUES (${email})
            `;

            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        const user = users[0] as {
            id: string;
            name: string;
            email: string;
            password_hash: string;
        };

        const passwordIsValid = await verifyPassword(
            password,
            user.password_hash
        );

        if (!passwordIsValid) {
            await sql`
                INSERT INTO login_attempts (email)
                VALUES (${email})
            `;

            return NextResponse.json(
                { error: "Invalid email or password." },
                { status: 401 }
            );
        }

        await sql`
            DELETE FROM login_attempts
            WHERE email = ${email}
        `;

        await createSession(user.id);

        return NextResponse.json({
            message: "Login successful.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { error: "Unable to log in. Please try again." },
            { status: 500 }
        );
    }
}
