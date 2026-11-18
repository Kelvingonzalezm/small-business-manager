import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { getProductById } from "@/app/lib/products";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const { id } = await params;
    const product = await getProductById(id, user.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#344054]">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
                    <div>
                        <Link
                            href="/"
                            className="text-xl font-bold tracking-tight text-[#16324F]"
                        >
                            Small Business Manager
                        </Link>
                        <p className="mt-1 text-sm text-slate-600">
                            Product details
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/products"
                            className="text-sm font-medium text-slate-700 hover:text-teal-800"
                        >
                            Products
                        </Link>
                        <span className="text-sm text-slate-700">
                            {user.name}
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-4xl px-5 py-9 sm:px-8 sm:py-12">
                <Link
                    href="/products"
                    className="text-sm font-semibold text-teal-800 hover:underline"
                >
                    ← Back to products
                </Link>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-800">
                        Product information
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16324F]">
                        {product.name}
                    </h1>

                    <div className="mt-8 space-y-6">
                        <section>
                            <h2 className="text-sm font-semibold text-slate-500">
                                Description
                            </h2>
                            <p className="mt-2 text-base text-slate-700">
                                {product.description || "No description provided."}
                            </p>
                        </section>

                        <div className="grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
                            <section>
                                <h2 className="text-sm font-semibold text-slate-500">
                                    Price
                                </h2>
                                <p className="mt-2 text-2xl font-semibold text-[#16324F]">
                                    {product.price}
                                </p>
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-slate-500">
                                    Quantity
                                </h2>
                                <p className="mt-2 text-2xl font-semibold text-[#16324F]">
                                    {product.quantity}
                                </p>
                            </section>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <Link
                            href="/products"
                            className="inline-flex rounded-lg bg-[#16324F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#214768]"
                        >
                            Back to product catalog
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-5 text-sm text-slate-500 sm:px-8">
                    Small Business Manager · Private product details for {user.name}
                </div>
            </footer>
        </div>
    );
}
