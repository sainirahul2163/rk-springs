import { useEffect, useRef } from 'react';
import { calculatorMaterials } from '@/data/materials';
import { track } from '@/lib/analytics';
import { computeExtension } from '@/lib/calculators/extension';
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
  nb: '',
  fi: '',
  x: '',
  material: 'hd',
};

export function ExtensionCalculator({ search = '' }: { search?: string }) {
  const [values, setField, ready] = useCalculatorState(DEFAULTS, search);
  const result = computeExtension(values);
  const tracked = useRef(false);

  useEffect(() => {
    if (result.ok && !tracked.current) {
      tracked.current = true;
      track('calculator_used', { tool: 'extension' });
    }
  }, [result.ok]);

  const material =
    calculatorMaterials.find((m) => m.id === values.material) ?? calculatorMaterials[1]!;
  const rows: ResultRow[] = result.ok
    ? [
        { label: 'Spring rate', value: sigfigs(result.k!), unit: 'N/mm', primary: true },
        { label: 'Active coils Na', value: sigfigs(result.Na!) },
        { label: 'Mean diameter D', value: sigfigs(result.D!), unit: 'mm' },
        { label: 'Spring index C', value: sigfigs(result.C!) },
        { label: 'Body length', value: sigfigs(result.body!), unit: 'mm' },
        { label: 'Load F', value: sigfigs(result.F!), unit: 'N' },
        {
          label: 'Body shear stress',
          value: result.tau !== null && Number.isFinite(result.tau) ? sigfigs(result.tau) : '—',
          unit: 'MPa',
        },
      ]
    : [];

  const quoteHref = calculatorRfqHref({
    type: 'extension',
    d: values.d,
    od: values.od,
    nb: values.nb,
    fi: values.fi,
    material: material.rfqValue,
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
          required
        />
        <NumberField
          label="Body coils Nb"
          name="nb"
          value={values.nb}
          onChange={(v) => setField('nb', v)}
          hint="Close-wound body coils, not including the hooks."
          required
        />
        <NumberField
          label="Initial tension Fi"
          name="fi"
          value={values.fi}
          onChange={(v) => setField('fi', v)}
          unit="N"
          hint="Optional. Leave blank for 0."
        />
        <NumberField
          label="Extension x"
          name="x"
          value={values.x}
          onChange={(v) => setField('x', v)}
          unit="mm"
          hint="Optional travel from the free body length."
        />
        <SelectField
          label="Material"
          name="material"
          value={values.material}
          onChange={(v) => setField('material', v)}
          options={calculatorMaterials.map((m) => ({ value: m.id, label: m.label }))}
          hint="G and E are typical published values, not measured here."
        />
      </form>
      <div>
        <ResultPanel
          rows={rows}
          emptyText={result.errors[0] ?? 'Enter the dimensions to see results.'}
        />
        <WarningList warnings={result.warnings} />
        <ToolActions tool="extension" quoteHref={quoteHref} />
      </div>
    </div>
  );
}
