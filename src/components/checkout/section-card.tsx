export function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue font-clash-display text-sm font-bold text-white">
          {step}
        </span>
        <div>
          <h2 className="font-clash-display text-lg font-bold text-blue">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}
