export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading business dashboard"
      className="min-h-screen bg-[#F7F8FA] px-5 py-12 sm:px-8"
    >
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-8 w-64 rounded bg-slate-200" />
        <div className="mt-4 h-5 w-full max-w-xl rounded bg-slate-200" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-36 rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
