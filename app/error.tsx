'use client';

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-5 py-12">
      <section
        aria-labelledby="dashboard-error-title"
        className="w-full max-w-xl rounded-2xl border border-rose-200 bg-white p-7 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-800">
          Dashboard unavailable
        </p>
        <h1
          id="dashboard-error-title"
          className="mt-2 text-2xl font-bold text-[#16324F]"
        >
          We could not load your business metrics
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your data has not been changed. Try loading the dashboard again in a
          moment.
        </p>
        <button
          className="mt-6 rounded-lg bg-[#16324F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#244866] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
