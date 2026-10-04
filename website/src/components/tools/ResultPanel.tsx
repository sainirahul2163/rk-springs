import type { ReactNode } from 'react';

export interface ResultRow {
  label: string;
  value: string;
  unit?: string;
  /** Highlight the headline result (e.g. spring rate). */
  primary?: boolean;
}

export interface ResultPanelProps {
  title?: string;
  rows: readonly ResultRow[];
  /** Shown instead of rows until the inputs are valid. */
  emptyText?: string;
  children?: ReactNode;
}

/** Results announce politely to screen readers as inputs change. */
export function ResultPanel({
  title = 'Results',
  rows,
  emptyText = 'Enter the dimensions to see results.',
  children,
}: ResultPanelProps) {
  const primary = rows.filter((r) => r.primary);
  const rest = rows.filter((r) => !r.primary);

  return (
    <section
      className="rounded-[var(--radius-card)] border border-grid bg-blue-50"
      aria-live="polite"
      aria-atomic="false"
    >
      <h3 className="border-b border-grid px-5 py-3 font-mono text-[0.8125rem] font-medium tracking-[0.08em] text-blue-800 uppercase">
        {title}
      </h3>
      {rows.length === 0 ? (
        <p className="px-5 py-6 text-slate">{emptyText}</p>
      ) : (
        <div className="px-5 py-4">
          {primary.map((r) => (
            <p key={r.label} className="pb-3">
              <span className="block text-[0.875rem] text-slate">{r.label}</span>
              <span className="tabular font-mono text-[2rem] leading-tight font-medium text-navy-900">
                {r.value}
              </span>
              {r.unit && <span className="ml-2 font-mono text-slate">{r.unit}</span>}
            </p>
          ))}
          {rest.length > 0 && (
            <dl className="divide-y divide-grid border-t border-grid">
              {rest.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-[0.9375rem] text-ink">{r.label}</dt>
                  <dd className="tabular text-right font-mono text-navy-900">
                    {r.value}
                    {r.unit && <span className="ml-1 text-slate">{r.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {children}
        </div>
      )}
    </section>
  );
}
