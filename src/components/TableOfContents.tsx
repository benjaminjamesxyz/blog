import { useState, useEffect, useMemo, useRef } from 'react';

interface Heading {
  id: string;
  text: string;
  depth: number;
}

function extractText(el: Element): string {
  return Array.from(el.childNodes)
    .map((node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
      if (node instanceof HTMLSpanElement || node instanceof HTMLAnchorElement) {
        return node.textContent ?? '';
      }
      return '';
    })
    .join('')
    .trim();
}

interface TableOfContentsProps {
  contentKey?: string;
}

export default function TableOfContents({ contentKey }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const [headings, setHeadings] = useState<Heading[]>([]);
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setHeadings([]);
    setActiveId('');

    const article = document.querySelector('.prose');
    if (!article) return;

    function scanHeadings() {
      const elements = Array.from(
        article!.querySelectorAll('h2, h3'),
      ) as HTMLElement[];

      if (elements.length === 0) return;

      setHeadings(
        elements.map((el) => ({
          id: el.id,
          text: extractText(el),
          depth: parseInt(el.tagName[1], 10),
        })),
      );

      if (ioRef.current) ioRef.current.disconnect();
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            setActiveId(visible[0].target.id);
          }
        },
        { rootMargin: '-80px 0px -70% 0px' },
      );
      ioRef.current = observer;
      elements.forEach((el) => observer.observe(el));
    }

    scanHeadings();

    let rafId: number | null = null;
    const mo = new MutationObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        scanHeadings();
      });
    });
    mo.observe(article, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      if (ioRef.current) ioRef.current.disconnect();
      ioRef.current = null;
    };
  }, [contentKey]);

  const minDepth = useMemo(
    () => Math.min(...headings.map((h) => h.depth)),
    [headings],
  );

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="not-prose">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
        On this page
      </h4>
      <ul className="space-y-1.5 text-sm border-l border-edge">
        {headings.map((h) => {
          const indent = h.depth - minDepth;
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block py-0.5 transition-colors ${
                  isActive
                    ? 'text-accent border-l-2 border-accent -ml-px pl-3'
                    : 'text-muted hover:text-primary pl-4'
                }`}
                style={indent > 0 ? { paddingLeft: `${(indent + 1) * 12 + 4}px` } : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
