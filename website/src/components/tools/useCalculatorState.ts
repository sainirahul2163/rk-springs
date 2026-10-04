import { useEffect, useState } from 'react';
import { readParams, replaceSearch, writeParams } from '@/lib/calculators/url';

/** Hydrate from the URL after mount so static HTML does not mismatch. */
export function useCalculatorState<T extends Record<string, string>>(
  defaults: T,
  search: string,
): [T, (key: keyof T, value: string) => void, boolean] {
  const [values, setValues] = useState<T>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const query = search || window.location.search;
    setValues(readParams(query, defaults));
    setReady(true);
  }, [search, defaults]);

  useEffect(() => {
    if (!ready) return;
    replaceSearch(writeParams(values, defaults));
  }, [ready, values, defaults]);

  function setField(key: keyof T, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return [values, setField, ready];
}
