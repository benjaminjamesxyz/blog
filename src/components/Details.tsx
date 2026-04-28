import { type ReactNode } from 'react';

interface DetailsProps {
  summary: string;
  children: ReactNode;
}

export default function Details({ summary, children }: DetailsProps) {
  return (
    <details className="not-prose my-4 group rounded-lg border border-edge bg-surface">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-heading hover:text-accent transition-colors flex items-center gap-2 select-none list-none">
        <svg
          className="w-3.5 h-3.5 text-muted group-open:rotate-90 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
        {summary}
      </summary>
      <div className="px-4 pb-4 text-sm text-primary border-t border-edge pt-3">
        {children}
      </div>
    </details>
  );
}
