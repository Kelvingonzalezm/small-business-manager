
import Link from 'next/link';
import { redirect } from 'next/navigation';
import MetricCard from '@/app/components/dashboard/MetricCard';
import { getCurrentUser, deleteSession } from '@/app/lib/auth';
import { getDashboardMetrics } from '@/app/lib/dashboard';
import {
  formatInventoryValue,
  formatMetricNumber,
} from '@/app/lib/dashboard-metrics';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const metrics = await getDashboardMetrics(user.id);

  async function handleSignOut() {
    'use server';

    await deleteSession();
    redirect('/login');
  }

  const hasBusinessData = metrics.productCount > 0 || metrics.supplierCount > 0;
  const inventoryValue = formatInventoryValue(metrics.inventoryValue);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#344054]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="#overview"
              className="text-xl font-bold tracking-tight text-[#16324F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
            >
              Small Business Manager
            </Link>
            <p className="mt-1 text-sm text-slate-600">Business overview</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <nav
              aria-label="Dashboard sections"
              className="flex flex-wrap gap-4"
            >
              <a
                className="text-sm font-semibold text-[#16324F] underline decoration-teal-700 decoration-2 underline-offset-4"
                href="#overview"
                aria-current="page"
              >
                Overview
              </a>
              <Link
                className="text-sm font-medium text-slate-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
                href="/products"
              >
                Products
              </Link>
              <a
                className="text-sm font-medium text-slate-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
                href="#inventory"
              >
                Inventory
              </a>
              <a
                className="text-sm font-medium text-slate-700 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
                href="#suppliers"
              >
                Suppliers
              </a>
            </nav>

            <span
              className="hidden h-6 border-l border-slate-200 sm:block"
              aria-hidden="true"
            />
            <span className="text-sm text-slate-700">{user.name}</span>
            <form action={handleSignOut}>
              <button
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-[#16324F] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
                type="submit"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main
        id="overview"
        className="mx-auto w-full max-w-7xl px-5 py-9 sm:px-8 sm:py-12"
      >
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-800">
              Your workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#16324F] sm:text-4xl">
              Welcome back, {user.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              A current snapshot of the products, stock, and suppliers saved to
              your account.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Metrics refresh when you load this page.
          </p>
        </div>

        {!hasBusinessData && (
          <section
            aria-labelledby="empty-state-title"
            className="mb-8 rounded-2xl border border-dashed border-teal-700/40 bg-teal-50 p-5 sm:p-6"
          >
            <h2
              id="empty-state-title"
              className="text-lg font-semibold text-[#16324F]"
            >
              Your business overview is ready
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              There are no saved products or suppliers for this account yet. The
              metrics below show the live database totals and will update as
              records are added.
            </p>
          </section>
        )}

        <section aria-labelledby="metrics-title">
          <div className="mb-4">
            <h2
              id="metrics-title"
              className="text-lg font-semibold text-[#16324F]"
            >
              Business metrics
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Calculated from your saved records; no sample figures are
              displayed.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Products"
              value={formatMetricNumber(metrics.productCount)}
              description="Items in your catalog"
              href="/products"
            />
            <MetricCard
              label="Inventory units"
              value={formatMetricNumber(metrics.totalUnits)}
              description="Units currently in stock"
              href="#inventory"
            />
            <MetricCard
              label="Inventory value (price x units)"
              value={inventoryValue}
              description="Stored price totals; no currency conversion"
              href="#inventory"
            />
            <MetricCard
              label="Suppliers"
              value={formatMetricNumber(metrics.supplierCount)}
              description="Suppliers linked to your account"
              href="#suppliers"
            />
          </div>
        </section>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <section
            id="products"
            aria-labelledby="products-title"
            className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Catalog
            </p>
            <h2
              id="products-title"
              className="mt-2 text-xl font-semibold text-[#16324F]"
            >
              Product overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You have {formatMetricNumber(metrics.productCount)} saved{' '}
              {metrics.productCount === 1 ? 'product' : 'products'}. Manage
              your catalog from the product management page.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex rounded-lg bg-[#16324F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#214768] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
            >
              Manage products
            </Link>
          </section>

          <section
            id="inventory"
            aria-labelledby="inventory-title"
            className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Stock
            </p>
            <h2
              id="inventory-title"
              className="mt-2 text-xl font-semibold text-[#16324F]"
            >
              Inventory snapshot
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {formatMetricNumber(metrics.totalUnits)} total units are recorded.
              Inventory value is {inventoryValue} in the stored price units; no
              currency conversion is applied.
            </p>
          </section>

          <section
            id="suppliers"
            aria-labelledby="suppliers-title"
            className="scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800">
              Partners
            </p>
            <h2
              id="suppliers-title"
              className="mt-2 text-xl font-semibold text-[#16324F]"
            >
              Supplier overview
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {formatMetricNumber(metrics.supplierCount)}{' '}
              {metrics.supplierCount === 1 ? 'supplier is' : 'suppliers are'}{' '}
              saved for your account.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 text-sm text-slate-500 sm:px-8">
          Small Business Manager · Private metrics for {user.name}
        </div>
      </footer>
    </div>
  );
}
