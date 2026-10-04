import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (token: string) => void },
      ) => string;
    };
  }
}

export function TurnstileField({
  siteKey,
  token,
  setToken,
}: {
  siteKey: string;
  token: string;
  setToken: (value: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) return;
    const mount = () => {
      if (!host.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(host.current, {
        sitekey: siteKey,
        callback: setToken,
      });
    };
    if (window.turnstile) {
      mount();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-rk-turnstile]');
    if (existing) {
      existing.addEventListener('load', mount);
      return () => existing.removeEventListener('load', mount);
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.dataset.rkTurnstile = '1';
    script.addEventListener('load', mount);
    document.head.appendChild(script);
    return undefined;
  }, [siteKey, setToken]);

  if (!siteKey) return null;
  return (
    <div>
      <div ref={host} />
      <input type="hidden" name="cf-turnstile-response" value={token} />
    </div>
  );
}
