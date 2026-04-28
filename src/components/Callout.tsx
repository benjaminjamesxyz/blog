import type { ReactNode } from 'react';

type CalloutVariant = 'note' | 'tip' | 'warning' | 'caution';

const config: Record<CalloutVariant, { icon: string; label: string; border: string; bg: string }> = {
  note: {
    icon: 'ℹ',
    label: 'Note',
    border: 'border-l-accent',
    bg: 'bg-accent/5',
  },
  tip: {
    icon: '💡',
    label: 'Tip',
    border: 'border-l-green-400',
    bg: 'bg-green-400/5',
  },
  warning: {
    icon: '⚠',
    label: 'Warning',
    border: 'border-l-yellow-400',
    bg: 'bg-yellow-400/5',
  },
  caution: {
    icon: '🔴',
    label: 'Caution',
    border: 'border-l-red-400',
    bg: 'bg-red-400/5',
  },
};

export function Note({ children }: { children: ReactNode }) {
  return <Callout variant="note">{children}</Callout>;
}

export function Tip({ children }: { children: ReactNode }) {
  return <Callout variant="tip">{children}</Callout>;
}

export function Warning({ children }: { children: ReactNode }) {
  return <Callout variant="warning">{children}</Callout>;
}

export function Caution({ children }: { children: ReactNode }) {
  return <Callout variant="caution">{children}</Callout>;
}

function Callout({ variant, children }: { variant: CalloutVariant; children: ReactNode }) {
  const c = config[variant];
  return (
    <div className={`not-prose my-6 rounded-r-lg border-l-4 ${c.border} ${c.bg} p-4`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-heading mb-1.5">
        <span>{c.icon}</span>
        <span>{c.label}</span>
      </div>
      <div className="text-sm text-primary leading-relaxed [&_p]:my-0">{children}</div>
    </div>
  );
}
