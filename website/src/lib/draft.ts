/** Draft-gated pages (e.g. spiral springs) render in dev and client-review builds only. */
export const allowDraft = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_TODOS === 'true';
