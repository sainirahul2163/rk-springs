import { useId, type ChangeEvent, type ReactNode } from 'react';

interface BaseProps {
  label: string;
  name: string;
  hint?: string | undefined;
  error?: string | undefined;
  required?: boolean | undefined;
}

function useFieldIds() {
  const id = useId();
  return { id, hintId: `${id}-hint`, errorId: `${id}-error` };
}

function describedBy(
  hint: string | undefined,
  error: string | undefined,
  hintId: string,
  errorId: string,
) {
  return [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined;
}

function FieldChrome({
  label,
  required,
  hint,
  error,
  hintId,
  errorId,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean | undefined;
  hint?: string | undefined;
  error?: string | undefined;
  hintId: string;
  errorId: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-error">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  label,
  name,
  value,
  onChange,
  hint,
  error,
  required,
  type = 'text',
  autoComplete,
  inputMode,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'date';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal';
}) {
  const { id, hintId, errorId } = useFieldIds();
  return (
    <FieldChrome
      label={label}
      required={required}
      hint={hint}
      error={error}
      hintId={hintId}
      errorId={errorId}
      htmlFor={id}
    >
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, hintId, errorId)}
        aria-required={required || undefined}
      />
    </FieldChrome>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  hint,
  error,
  required,
  rows = 4,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const { id, hintId, errorId } = useFieldIds();
  return (
    <FieldChrome
      label={label}
      required={required}
      hint={hint}
      error={error}
      hintId={hintId}
      errorId={errorId}
      htmlFor={id}
    >
      <textarea
        id={id}
        name={name}
        rows={rows}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, hintId, errorId)}
        aria-required={required || undefined}
      />
    </FieldChrome>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  hint,
  error,
  required,
}: BaseProps & {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const { id, hintId, errorId } = useFieldIds();
  return (
    <FieldChrome
      label={label}
      required={required}
      hint={hint}
      error={error}
      hintId={hintId}
      errorId={errorId}
      htmlFor={id}
    >
      <select
        id={id}
        name={name}
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, hintId, errorId)}
        aria-required={required || undefined}
      >
        {options.map((option) => (
          <option key={option.value || 'empty'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldChrome>
  );
}

export function CheckField({
  name,
  checked,
  onChange,
  children,
  error,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  error?: string | undefined;
}) {
  const { id, errorId } = useFieldIds();
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="flex min-h-11 items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          className="check"
          checked={checked}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <span>{children}</span>
      </label>
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
