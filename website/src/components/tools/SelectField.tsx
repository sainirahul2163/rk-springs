import { useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: readonly SelectOption[];
  onChange?: (value: string) => void;
  hint?: string;
}

export function SelectField({ label, name, value, options, onChange, hint }: SelectFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select
        id={id}
        name={name}
        className="field-input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-describedby={hint ? hintId : undefined}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
    </div>
  );
}
