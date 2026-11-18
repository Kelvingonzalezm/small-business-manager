import Link from "next/link";
import { redirect } from "next/navigation";
import ProductsManager from "@/app/components/products/ProductsManager";
import { getCurrentUser } from "@/app/lib/auth";

export default async function ProductsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#344054]">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <div>
                        <Link
                            href="/"
                            className="text-xl font-bold tracking-tight text-[#16324F]"
                        >
                            Small Business Manager
                        </Link>
                        <p className="mt-1 text-sm text-slate-600">
                            Product management
                        </p>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-700 hover:text-teal-800"
                        >
                            Dashboard
                        </Link>
                        <span className="text-sm text-slate-700">
                            {user.name}
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-800">
                        Your workspace
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16324F] sm:text-4xl">
                        Product management
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                        Create, view, update, and manage the products saved to
                        your account.
                    </p>
                </div>

                <ProductsManager />
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-5 text-sm text-slate-500 sm:px-8">
                    Small Business Manager · Private product catalog for {user.name}
                </div>
            </footer>
        </div>
    );
}
