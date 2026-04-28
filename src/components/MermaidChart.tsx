import { useEffect, useState, useId } from 'react';

const mermaidReady = import('mermaid').then((mod) => {
  const mermaid = mod.default;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
  });
  return mermaid;
});

export default function MermaidChart({ chart }: { chart: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const uniqueId = useId().replace(/:/g, '_');

  useEffect(() => {
    let cancelled = false;

    mermaidReady
      .then(async (mermaid) => {
        if (cancelled) return;

        const { svg: rendered } = await mermaid.render(
          `mermaid_${uniqueId}`,
          chart.trim(),
        );
        if (!cancelled) {
          setSvg(rendered);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart, uniqueId]);

  if (error) {
    return (
      <pre className="text-sm p-4 rounded-lg overflow-x-auto bg-error-bg text-error">
        {error}
      </pre>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse h-48 rounded-lg my-6 bg-surface" />
    );
  }

  return (
    <div
      className="mermaid-wrapper flex justify-center my-6 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
