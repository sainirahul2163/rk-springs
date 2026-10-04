import { useState } from 'react';
import { track } from '@/lib/analytics';

export interface ToolActionsProps {
  tool: 'compression' | 'extension' | 'converter';
  quoteHref: string;
  quoteLabel?: string;
}

export function ToolActions({
  tool,
  quoteHref,
  quoteLabel = 'Get this spring made',
}: ToolActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const href = window.location.href;
    try {
      await navigator.clipboard.writeText(href);
    } catch {
      window.prompt('Copy this link', href);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button type="button" className="btn-secondary" onClick={() => void copyLink()}>
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <a
        href={quoteHref}
        className="btn-primary no-underline"
        onClick={() => track('quote_from_calculator', { tool })}
      >
        {quoteLabel}
      </a>
    </div>
  );
}
