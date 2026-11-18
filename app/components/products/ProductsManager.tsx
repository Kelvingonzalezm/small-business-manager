"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: string;
    quantity: number;
    supplier_id: string | null;
}

export default function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    async function loadProducts() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/products");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not load products.");
            }

            setProducts(data.products);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    function resetForm() {
        setName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setEditingId(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const productData = {
                name: name.trim(),
                description: description.trim() || null,
                price,
                quantity: Number(quantity),
                supplierId: null,
            };

            const response = await fetch(
                editingId ? `/api/products/${editingId}` : "/api/products",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not save product.");
            }

            resetForm();
            await loadProducts();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(product: Product) {
        setEditingId(product.id);
        setName(product.name);
        setDescription(product.description || "");
        setPrice(product.price);
        setQuantity(String(product.quantity));

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleDelete(productId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not delete product.");
            }

            await loadProducts();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        }
    }

    return (
        <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#16324F]">
                    {editingId ? "Edit product" : "Add a new product"}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Enter the product information below.
                </p>

                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Product name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            maxLength={150}
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-teal-700"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-teal-700"
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="price"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Price
                            </label>
                            <input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(event) =>
                                    setPrice(event.target.value)
                                }
                                min="0"
                                max="99999999.99"
                                step="0.01"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-teal-700"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="quantity"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Quantity
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(event) =>
                                    setQuantity(event.target.value)
                                }
                                min="0"
                                max="2147483647"
                                step="1"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-teal-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-[#16324F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#214768] disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update product"
                                    : "Add product"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-[#16324F]">
                        Product catalog
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage the products in your business.
                    </p>
                </div>

                {loading ? (
                    <p className="text-sm text-slate-600">
                        Loading products...
                    </p>
                ) : products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <p className="font-semibold text-slate-700">
                            No products yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Add your first product using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                            >
                                <div>
                                    <h3 className="font-bold text-[#16324F]">
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className="mt-1 text-sm text-slate-600">
                                            {product.description}
                                        </p>
                                    )}

                                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                                        <span>Price: {product.price}</span>
                                        <span>
                                            Quantity: {product.quantity}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-wrap gap-2">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="rounded-lg border border-teal-200 px-3 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50"
                                    >
                                        View details
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(product)}
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[#16324F] hover:bg-slate-50"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(product.id)}
                                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
