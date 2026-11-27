import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
    createSupplier,
    getSuppliers,
    type SupplierInput,
} from "@/app/lib/suppliers";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        const suppliers = await getSuppliers(user.id);

        return NextResponse.json({ suppliers });
    } catch (error) {
        console.error("Get suppliers error:", error);

        return NextResponse.json(
            { error: "Failed to retrieve suppliers." },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        const body: unknown = await request.json();

        if (
            typeof body !== "object" ||
            body === null ||
            Array.isArray(body)
        ) {
            return NextResponse.json(
                { error: "Invalid supplier data." },
                { status: 400 }
            );
        }

        const data = body as Record<string, unknown>;

        const name =
            typeof data.name === "string" ? data.name.trim() : "";

        const email =
            typeof data.email === "string"
                ? data.email.trim() || null
                : null;

        const phone =
            typeof data.phone === "string"
                ? data.phone.trim() || null
                : null;

        const validEmail =
            email === null ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (
            !name ||
            name.length > 150 ||
            (email !== null && (email.length > 255 || !validEmail)) ||
            (phone !== null && phone.length > 30) ||
            (data.email !== undefined &&
                data.email !== null &&
                typeof data.email !== "string") ||
            (data.phone !== undefined &&
                data.phone !== null &&
                typeof data.phone !== "string")
        ) {
            return NextResponse.json(
                { error: "Please provide valid supplier data." },
                { status: 400 }
            );
        }

        const supplierData: SupplierInput = {
            name,
            email,
            phone,
        };

        const supplier = await createSupplier(user.id, supplierData);

        return NextResponse.json(
            { supplier },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create supplier error:", error);

        return NextResponse.json(
            { error: "Failed to create supplier." },
            { status: 500 }
        );
    }
}
