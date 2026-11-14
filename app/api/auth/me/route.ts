
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Authentication check error:", error);

        return NextResponse.json(
            { error: "Unable to verify authentication." },
            { status: 500 }
        );
    }
}
