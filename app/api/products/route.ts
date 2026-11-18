import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
    createProduct,
    getProducts,
    type ProductInput,
} from "@/app/lib/products";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { error: "Not authenticated." },
                { status: 401 }
            );
        }

        const products = await getProducts(user.id);

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Get products error:", error);

        return NextResponse.json(
            { error: "Failed to retrieve products." },
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

        const product = await createProduct(user.id, productData);

        return NextResponse.json(
            { product },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create product error:", error);

        return NextResponse.json(
            { error: "Failed to create product." },
            { status: 500 }
        );
    }
}
