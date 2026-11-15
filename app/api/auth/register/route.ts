
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";
import { createSession, hashPassword } from "@/app/lib/auth";

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

        const name =
            typeof data.name === "string" ? data.name.trim() : "";
        const email =
            typeof data.email === "string"
                ? data.email.trim().toLowerCase()
                : "";
        const password =
            typeof data.password === "string" ? data.password : "";

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        if (name.length > 100) {
            return NextResponse.json(
                { error: "Name must be 100 characters or fewer." },
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

        if (password.length < 8 || password.length > 72) {
            return NextResponse.json(
                { error: "Password must be between 8 and 72 characters." },
                { status: 400 }
            );
        }

        const existingUsers = await sql`
            SELECT id
            FROM users
            WHERE LOWER(email) = ${email}
            LIMIT 1
        `;

        if (existingUsers.length > 0) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const passwordHash = await hashPassword(password);

        const newUsers = await sql`
            INSERT INTO users (name, email, password_hash)
            VALUES (${name}, ${email}, ${passwordHash})
            RETURNING id, name, email
        `;

        const newUser = newUsers[0] as {
            id: string;
            name: string;
            email: string;
        };

        await createSession(newUser.id);

        return NextResponse.json(
            {
                message: "Account created successfully.",
                user: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 }
            );
        }

        console.error("Registration error:", error);

        return NextResponse.json(
            { error: "Unable to create the account. Please try again." },
            { status: 500 }
        );
    }
}
