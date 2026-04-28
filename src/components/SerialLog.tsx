interface SerialLogProps {
  children: string;
}

function colorize(line: string): { text: string; className: string } {
  const trimmed = line.trimStart();
  if (/^\[(INFO|OK)\]/.test(trimmed)) return { text: line, className: 'text-[#7ee787]' };
  if (/^\[(WARN|WARNING)\]/.test(trimmed)) return { text: line, className: 'text-[#e3b341]' };
  if (/^\[(ERROR|FAIL)\]/.test(trimmed)) return { text: line, className: 'text-error' };
  if (/^\[DEBUG\]/.test(trimmed)) return { text: line, className: 'text-dim' };
  return { text: line, className: 'text-primary' };
}

export default function SerialLog({ children }: SerialLogProps) {
  const lines = children.split('\n').filter((l) => l.trim() !== '');
  return (
    <div className="not-prose my-6 rounded-lg bg-[#0d1117] border border-edge overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-elevated/50 border-b border-edge">
        <span className="w-2.5 h-2.5 rounded-full bg-error/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e3b341]/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7ee787]/80" />
        <span className="ml-2 text-[10px] text-dim font-mono">serial terminal</span>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono max-h-80 overflow-y-auto">
        {lines.map((line, i) => {
          const { text, className } = colorize(line);
          return (
            <span key={i} className={className}>
              {text}
              {'\n'}
            </span>
          );
        })}
        <span className="inline-block w-2 h-3.5 bg-primary animate-pulse" />
      </pre>
    </div>
  );
}
