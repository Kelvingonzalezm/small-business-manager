
import { NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/auth";

export async function POST() {
    try {
        await deleteSession();

        return NextResponse.json({
            message: "Logout successful.",
        });
    } catch (error) {
        console.error("Logout error:", error);

        return NextResponse.json(
            { error: "Unable to log out. Please try again." },
            { status: 500 }
        );
    }
}
