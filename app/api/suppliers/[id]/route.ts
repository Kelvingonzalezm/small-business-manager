import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
    deleteSupplier,
    getSupplierById,
    updateSupplier,
    type SupplierInput,
} from "@/app/lib/suppliers";

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            return NextResponse.json(
                { error: "Invalid supplier ID." },
                { status: 400 }
            );
        }

        const supplier = await getSupplierById(id, user.id);

        if (!supplier) {
            return NextResponse.json(
                { error: "Supplier not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ supplier });
    } catch (error) {
        console.error("Get supplier error:", error);

        return NextResponse.json(
            { error: "Failed to retrieve supplier." },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            return NextResponse.json(
                { error: "Invalid supplier ID." },
                { status: 400 }
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

        const supplier = await updateSupplier(
            id,
            user.id,
            supplierData
        );

        if (!supplier) {
            return NextResponse.json(
                { error: "Supplier not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ supplier });
    } catch (error) {
        console.error("Update supplier error:", error);

        return NextResponse.json(
            { error: "Failed to update supplier." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        const { id } = await params;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
            return NextResponse.json(
                { error: "Invalid supplier ID." },
                { status: 400 }
            );
        }

        const deleted = await deleteSupplier(id, user.id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Supplier not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Supplier deleted successfully." }
        );
    } catch (error) {
        console.error("Delete supplier error:", error);

        return NextResponse.json(
            { error: "Failed to delete supplier." },
            { status: 500 }
        );
    }
}
