"use client";

import { useEffect, useState, type FormEvent } from "react";

interface Supplier {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
}

export default function SuppliersManager() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    async function loadSuppliers() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/suppliers");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not load suppliers.");
            }

            setSuppliers(data.suppliers);
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
            loadSuppliers();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    function resetForm() {
        setName("");
        setEmail("");
        setPhone("");
        setEditingId(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const supplierData = {
                name: name.trim(),
                email: email.trim() || null,
                phone: phone.trim() || null,
            };

            const response = await fetch(
                editingId ? `/api/suppliers/${editingId}` : "/api/suppliers",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(supplierData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not save supplier.");
            }

            resetForm();
            await loadSuppliers();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    }

    function handleEdit(supplier: Supplier) {
        setEditingId(supplier.id);
        setName(supplier.name);
        setEmail(supplier.email || "");
        setPhone(supplier.phone || "");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function handleDelete(supplierId: string) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this supplier?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(`/api/suppliers/${supplierId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Could not delete supplier.");
            }

            await loadSuppliers();
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
                    {editingId ? "Edit supplier" : "Add a new supplier"}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                    Enter the supplier information below.
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
                            Supplier name
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

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                maxLength={255}
                                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-teal-700"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Phone
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                maxLength={30}
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
                                    ? "Update supplier"
                                    : "Add supplier"}
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
                        Supplier list
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Manage the suppliers in your business.
                    </p>
                </div>

                {loading ? (
                    <p className="text-sm text-slate-600">
                        Loading suppliers...
                    </p>
                ) : suppliers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                        <p className="font-semibold text-slate-700">
                            No suppliers yet
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Add your first supplier using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {suppliers.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                            >
                                <div>
                                    <h3 className="font-bold text-[#16324F]">
                                        {supplier.name}
                                    </h3>

                                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                                        {supplier.email && (
                                            <span>Email: {supplier.email}</span>
                                        )}
                                        {supplier.phone && (
                                            <span>Phone: {supplier.phone}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(supplier)}
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[#16324F] hover:bg-slate-50"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(supplier.id)}
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
