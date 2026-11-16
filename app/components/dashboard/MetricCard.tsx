interface MetricCardProps {
  label: string;
  value: string;
  description: string;
  href: string;
}

export default function MetricCard({
  label,
  value,
  description,
  href,
}: MetricCardProps) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
    >
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#16324F]">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <span className="mt-4 inline-flex text-sm font-semibold text-teal-800 group-hover:underline">
        View details{' '}
        <span aria-hidden="true" className="ml-1">
          {'>'}
        </span>
      </span>
    </a>
  );
}
