import { useId } from 'react';

export interface NumberFieldProps {
  label: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  unit?: string;
  hint?: string;
  error?: string | undefined;
  min?: number;
  max?: number;
  step?: number | 'any';
  required?: boolean;
}

/** Decimal input with a unit suffix. Keeps the raw string so users can type "1." freely. */
export function NumberField({
  label,
  name,
  value,
  onChange,
  unit,
  hint,
  error,
  min,
  max,
  step = 'any',
  required = false,
}: NumberFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
        {unit && <span className="font-normal text-slate"> ({unit})</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          className={`field-input tabular ${unit ? 'pr-16' : ''}`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={!onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          data-min={min}
          data-max={max}
          data-step={step}
        />
        {unit && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-[0.875rem] text-slate"
          >
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field-error">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="mt-0.5 flex-none"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
