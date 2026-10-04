export interface CalcWarning {
  id: string;
  text: string;
}

/** Design warnings (e.g. spring index out of range). Icon + "Check:" label, never colour alone. */
export function WarningList({ warnings }: { warnings: readonly CalcWarning[] }) {
  if (warnings.length === 0) return null;
  return (
    <ul className="mt-4 grid gap-2" aria-label="Design warnings">
      {warnings.map((w) => (
        <li
          key={w.id}
          className="flex gap-2 rounded-[var(--radius-control)] border border-warning bg-white px-3 py-2 text-[0.9375rem] text-ink"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className="mt-0.5 flex-none text-warning"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          <span>
            <strong className="font-semibold text-warning">Check: </strong>
            {w.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
