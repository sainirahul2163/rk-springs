import { useEffect, useRef } from 'react';
import { calculatorMaterials } from '@/data/materials';
import { track } from '@/lib/analytics';
import {
  computeCompression,
  END_TYPE_LABELS,
  END_TYPES,
  type EndType,
} from '@/lib/calculators/compression';
import { sigfigs } from '@/lib/calculators/format';
import { calculatorRfqHref } from '@/lib/calculators/quote';
import { NumberField } from './NumberField';
import { ResultPanel, type ResultRow } from './ResultPanel';
import { SelectField } from './SelectField';
import { ToolActions } from './ToolActions';
import { useCalculatorState } from './useCalculatorState';
import { WarningList } from './WarningList';

const DEFAULTS = {
  d: '',
  od: '',
  id: '',
  l0: '',
  nt: '',
  ends: 'closed-ground',
  material: 'hd',
  l1: '',
  l2: '',
};

function asEndType(value: string): EndType {
  return (END_TYPES as readonly string[]).includes(value) ? (value as EndType) : 'closed-ground';
}

export function CompressionCalculator({ search = '' }: { search?: string }) {
  const [values, setField, ready] = useCalculatorState(DEFAULTS, search);
  const result = computeCompression({ ...values, ends: asEndType(values.ends) });
  const tracked = useRef(false);

  useEffect(() => {
    if (result.ok && !tracked.current) {
      tracked.current = true;
      track('calculator_used', { tool: 'compression' });
    }
  }, [result.ok]);

  const material =
    calculatorMaterials.find((m) => m.id === values.material) ?? calculatorMaterials[1]!;
  const rows: ResultRow[] = result.ok
    ? [
        { label: 'Spring rate', value: sigfigs(result.k!), unit: 'N/mm', primary: true },
        { label: 'Mean diameter D', value: sigfigs(result.D!), unit: 'mm' },
        { label: 'Spring index C', value: sigfigs(result.C!) },
        { label: 'Active coils Na', value: sigfigs(result.Na!) },
        { label: 'Solid height Ls', value: sigfigs(result.Ls!), unit: 'mm' },
        ...result.loads.flatMap((load, i) => [
          { label: `Load at ${sigfigs(load.L)} mm`, value: sigfigs(load.F), unit: 'N' },
          {
            label: `Shear stress at L${i + 1}`,
            value: Number.isFinite(load.tau) ? sigfigs(load.tau) : '—',
            unit: 'MPa',
          },
        ]),
      ]
    : [];

  const quoteHref = calculatorRfqHref({
    type: 'compression',
    d: values.d,
    od: values.od,
    id: values.id,
    l0: values.l0,
    nt: values.nt,
    ends: values.ends,
    material: material.rfqValue,
    l1: values.l1,
    l2: values.l2,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]">
      <form
        className="grid gap-5 sm:grid-cols-2"
        data-ready={ready ? 'true' : undefined}
        onSubmit={(e) => e.preventDefault()}
      >
        <NumberField
          label="Wire diameter d"
          name="d"
          value={values.d}
          onChange={(v) => setField('d', v)}
          unit="mm"
          required
        />
        <NumberField
          label="Outer diameter OD"
          name="od"
          value={values.od}
          onChange={(v) => setField('od', v)}
          unit="mm"
          hint="Or enter ID below."
        />
        <NumberField
          label="Inner diameter ID"
          name="id"
          value={values.id}
          onChange={(v) => setField('id', v)}
          unit="mm"
        />
        <NumberField
          label="Free length L0"
          name="l0"
          value={values.l0}
          onChange={(v) => setField('l0', v)}
          unit="mm"
          required
        />
        <NumberField
          label="Total coils Nt"
          name="nt"
          value={values.nt}
          onChange={(v) => setField('nt', v)}
          required
        />
        <SelectField
          label="End type"
          name="ends"
          value={asEndType(values.ends)}
          onChange={(v) => setField('ends', v)}
          options={END_TYPES.map((id) => ({ value: id, label: END_TYPE_LABELS[id] }))}
        />
        <SelectField
          label="Material"
          name="material"
          value={values.material}
          onChange={(v) => setField('material', v)}
          options={calculatorMaterials.map((m) => ({ value: m.id, label: m.label }))}
          hint="G is a typical published value, not measured here."
        />
        <NumberField
          label="Working length L1"
          name="l1"
          value={values.l1}
          onChange={(v) => setField('l1', v)}
          unit="mm"
          hint="Optional."
        />
        <NumberField
          label="Working length L2"
          name="l2"
          value={values.l2}
          onChange={(v) => setField('l2', v)}
          unit="mm"
          hint="Optional."
        />
      </form>
      <div>
        <ResultPanel
          rows={rows}
          emptyText={result.errors[0] ?? 'Enter the dimensions to see results.'}
        />
        <WarningList warnings={result.warnings} />
        <ToolActions tool="compression" quoteHref={quoteHref} />
      </div>
    </div>
  );
}
