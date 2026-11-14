
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { sql } from "@/app/lib/db";

const SESSION_COOKIE_NAME = "sbm_session";
const SESSION_DURATION = 7 * 24 * 60 * 60;

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}

export async function verifyPassword(
    password: string,
    passwordHash: string
): Promise<boolean> {
    return compare(password, passwordHash);
}

function hashSessionToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
    const token = randomBytes(32).toString("hex");
    const tokenHash = hashSessionToken(token);

    const expiresAt = new Date(
        Date.now() + SESSION_DURATION * 1000
    );

    await sql`
        INSERT INTO sessions (user_id, token_hash, expires_at)
        VALUES (${userId}, ${tokenHash}, ${expiresAt})
    `;

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_DURATION,
    });
}

export async function getCurrentUser(): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return null;
    }

    const tokenHash = hashSessionToken(token);

    const result = await sql`
        SELECT users.id, users.name, users.email
        FROM sessions
        INNER JOIN users ON sessions.user_id = users.id
        WHERE sessions.token_hash = ${tokenHash}
          AND sessions.expires_at > NOW()
        LIMIT 1
    `;

    if (result.length === 0) {
        return null;
    }

    return result[0] as AuthUser;
}

export async function deleteSession(): Promise<void> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
        const tokenHash = hashSessionToken(token);

        await sql`
            DELETE FROM sessions
            WHERE token_hash = ${tokenHash}
        `;
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
}
