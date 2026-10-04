import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import {
  fromMm,
  fromNewton,
  fromNMmPerDeg,
  fromNPerMm,
  parseAmount,
  toMm,
  toNewton,
  toNMmPerDeg,
  toNPerMm,
  type ForceUnit,
  type LengthUnit,
  type RateUnit,
  type TorqueUnit,
} from '@/lib/calculators/convert';
import { sigfigs } from '@/lib/calculators/format';
import { calculatorRfqHref } from '@/lib/calculators/quote';
import { NumberField } from './NumberField';
import { ResultPanel, type ResultRow } from './ResultPanel';
import { SelectField } from './SelectField';
import { ToolActions } from './ToolActions';
import { useCalculatorState } from './useCalculatorState';

const DEFAULTS = {
  rate: '',
  rateUnit: 'N/mm',
  force: '',
  forceUnit: 'N',
  length: '',
  lengthUnit: 'mm',
  torque: '',
  torqueUnit: 'N·mm/°',
};

const RATE_UNITS: RateUnit[] = ['N/mm', 'kgf/mm', 'lbf/in'];
const FORCE_UNITS: ForceUnit[] = ['N', 'kgf', 'lbf'];
const LENGTH_UNITS: LengthUnit[] = ['mm', 'in'];
const TORQUE_UNITS: TorqueUnit[] = ['N·mm/°', 'kgf·mm/°', 'lbf·in/°'];

function pick<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

function rowsFrom<T extends string>(
  raw: string,
  unit: T,
  toBase: (n: number, u: T) => number,
  fromBase: (n: number, u: T) => number,
  units: readonly T[],
): ResultRow[] {
  const n = parseAmount(raw);
  if (n === null) return [];
  const base = toBase(n, unit);
  return units.map((u) => ({
    label: u,
    value: sigfigs(fromBase(base, u)),
    unit: u,
    primary: u === units[0],
  }));
}

export function RateConverter({ search = '' }: { search?: string }) {
  const [values, setField, ready] = useCalculatorState(DEFAULTS, search);
  const tracked = useRef(false);
  const rateUnit = pick(values.rateUnit, RATE_UNITS, 'N/mm');
  const forceUnit = pick(values.forceUnit, FORCE_UNITS, 'N');
  const lengthUnit = pick(values.lengthUnit, LENGTH_UNITS, 'mm');
  const torqueUnit = pick(values.torqueUnit, TORQUE_UNITS, 'N·mm/°');

  const hasAny =
    parseAmount(values.rate) !== null ||
    parseAmount(values.force) !== null ||
    parseAmount(values.length) !== null ||
    parseAmount(values.torque) !== null;

  useEffect(() => {
    if (hasAny && !tracked.current) {
      tracked.current = true;
      track('calculator_used', { tool: 'converter' });
    }
  }, [hasAny]);

  return (
    <div className="grid gap-10" data-ready={ready ? 'true' : undefined}>
      <ConverterBlock
        title="Spring rate"
        value={values.rate}
        unit={rateUnit}
        units={RATE_UNITS}
        onValue={(v) => setField('rate', v)}
        onUnit={(v) => setField('rateUnit', v)}
        rows={rowsFrom(values.rate, rateUnit, toNPerMm, fromNPerMm, RATE_UNITS)}
      />
      <ConverterBlock
        title="Force"
        value={values.force}
        unit={forceUnit}
        units={FORCE_UNITS}
        onValue={(v) => setField('force', v)}
        onUnit={(v) => setField('forceUnit', v)}
        rows={rowsFrom(values.force, forceUnit, toNewton, fromNewton, FORCE_UNITS)}
      />
      <ConverterBlock
        title="Length"
        value={values.length}
        unit={lengthUnit}
        units={LENGTH_UNITS}
        onValue={(v) => setField('length', v)}
        onUnit={(v) => setField('lengthUnit', v)}
        rows={rowsFrom(values.length, lengthUnit, toMm, fromMm, LENGTH_UNITS)}
      />
      <ConverterBlock
        title="Torque per degree"
        value={values.torque}
        unit={torqueUnit}
        units={TORQUE_UNITS}
        onValue={(v) => setField('torque', v)}
        onUnit={(v) => setField('torqueUnit', v)}
        rows={rowsFrom(values.torque, torqueUnit, toNMmPerDeg, fromNMmPerDeg, TORQUE_UNITS)}
      />
      <ToolActions
        tool="converter"
        quoteHref={calculatorRfqHref({})}
        quoteLabel="Request a quote"
      />
    </div>
  );
}

function ConverterBlock({
  title,
  value,
  unit,
  units,
  onValue,
  onUnit,
  rows,
}: {
  title: string;
  value: string;
  unit: string;
  units: readonly string[];
  onValue: (value: string) => void;
  onUnit: (value: string) => void;
  rows: ResultRow[];
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
      <form className="grid gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-h3 sm:col-span-2">{title}</h2>
        <NumberField label="Value" name={`${title}-value`} value={value} onChange={onValue} />
        <SelectField
          label="Unit"
          name={`${title}-unit`}
          value={unit}
          onChange={onUnit}
          options={units.map((u) => ({ value: u, label: u }))}
        />
      </form>
      <ResultPanel title={title} rows={rows} emptyText="Enter a value to convert." />
    </section>
  );
}
