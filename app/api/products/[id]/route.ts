import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
    deleteProduct,
    getProductById,
    updateProduct,
    type ProductInput,
} from "@/app/lib/products";

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
                { error: "Invalid product ID." },
                { status: 400 }
            );
        }

        const product = await getProductById(id, user.id);

        if (!product) {
            return NextResponse.json(
                { error: "Product not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Get product error:", error);

        return NextResponse.json(
            { error: "Failed to retrieve product." },
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
                { error: "Invalid product ID." },
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
                { error: "Invalid product data." },
                { status: 400 }
            );
        }

        const data = body as Record<string, unknown>;

        const name =
            typeof data.name === "string" ? data.name.trim() : "";

        const description =
            typeof data.description === "string"
                ? data.description.trim() || null
                : null;

        const price =
            typeof data.price === "string" ||
                typeof data.price === "number"
                ? String(data.price).trim()
                : "";

        const quantity = data.quantity;

        const supplierId =
            typeof data.supplierId === "string" &&
                data.supplierId.trim() !== ""
                ? data.supplierId.trim()
                : null;

        const validPrice =
            /^\d+(\.\d{1,2})?$/.test(price) &&
            Number(price) <= 99999999.99;

        if (
            !name ||
            name.length > 150 ||
            !validPrice ||
            typeof quantity !== "number" ||
            !Number.isSafeInteger(quantity) ||
            quantity < 0 ||
            quantity > 2147483647 ||
            (data.description !== undefined &&
                data.description !== null &&
                typeof data.description !== "string") ||
            (data.supplierId !== undefined &&
                data.supplierId !== null &&
                typeof data.supplierId !== "string")
        ) {
            return NextResponse.json(
                { error: "Please provide valid product data." },
                { status: 400 }
            );
        }

        const productData: ProductInput = {
            name,
            description,
            price,
            quantity,
            supplierId,
        };

        const product = await updateProduct(
            id,
            user.id,
            productData
        );

        if (!product) {
            return NextResponse.json(
                { error: "Product not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ product });
    } catch (error) {
        console.error("Update product error:", error);

        return NextResponse.json(
            { error: "Failed to update product." },
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
                { error: "Invalid product ID." },
                { status: 400 }
            );
        }

        const deleted = await deleteProduct(id, user.id);

        if (!deleted) {
            return NextResponse.json(
                { error: "Product not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Product deleted successfully." }
        );
    } catch (error) {
        console.error("Delete product error:", error);

        return NextResponse.json(
            { error: "Failed to delete product." },
            { status: 500 }
        );
    }
}
