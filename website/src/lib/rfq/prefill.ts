import { calculatorMaterials } from '@/data/materials';
import { TYPE_ALIASES, type SpringType } from './schema';

const SPEC_QUERY: Record<string, string> = {
  d: 'wire_d',
  wire: 'wire_d',
  od: 'od',
  id: 'id',
  l0: 'free_length',
  L0: 'free_length',
  free_length: 'free_length',
  nt: 'coils',
  nb: 'coils',
  coils: 'coils',
  material: 'material',
  ends: 'end_type',
  end_type: 'end_type',
  l1: 'length_l1',
  length_l1: 'length_l1',
  l2: 'length_l2',
  length_l2: 'length_l2',
  fi: 'initial_tension',
  initial_tension: 'initial_tension',
};

function mapMaterial(value: string): string {
  return calculatorMaterials.find((m) => m.id === value)?.rfqValue ?? value;
}

export function parsePrefill(search: string): {
  type: SpringType | '';
  specs: Record<string, string>;
} {
  const query = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const raw = (query.get('type') ?? '').toLowerCase();
  const aliased = TYPE_ALIASES[raw];
  const type = aliased && aliased !== 'general' ? aliased : aliased === 'general' ? 'general' : '';
  const specs: Record<string, string> = {};
  for (const [from, to] of Object.entries(SPEC_QUERY)) {
    const value = query.get(from);
    if (value) specs[to] = to === 'material' ? mapMaterial(value) : value;
  }
  return { type, specs };
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export function readUtm(search: string, storedJson?: string | null): Record<string, string> {
  let previous: Record<string, string> = {};
  if (storedJson) {
    try {
      previous = JSON.parse(storedJson) as Record<string, string>;
    } catch {
      previous = {};
    }
  }
  const query = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const next = { ...previous };
  for (const key of UTM_KEYS) {
    const value = query.get(key);
    if (value) next[key] = value;
  }
  return next;
}
