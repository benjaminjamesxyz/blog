import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MiniSearch from 'minisearch';
import { searchEntries } from '../generated/search-index';

type SearchResult = { slug: string; title: string; description: string; tags: string };

const miniSearch = new MiniSearch<SearchResult>({
  fields: ['title', 'description', 'tags', 'content'],
  storeFields: ['slug', 'title', 'description', 'tags'],
  idField: 'slug',
  searchOptions: {
    boost: { title: 3, tags: 2 },
    prefix: true,
    fuzzy: 0.2,
  },
});

miniSearch.addAll(searchEntries as SearchResult[]);

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setSelected(0);
      return;
    }
    const hits = miniSearch.search(query.trim()) as unknown as SearchResult[];
    setResults(hits.slice(0, 8));
    setSelected(0);
  }, [query]);

  const go = useCallback((slug: string) => {
    navigate(`/post/${slug}`);
    onClose();
  }, [navigate, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      else if (e.key === 'Enter' && results[selected]) { e.preventDefault(); go(results[selected].slug); }
      else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selected, go, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-base border border-edge rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-edge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted shrink-0">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 py-3.5 bg-transparent text-primary placeholder:text-dim outline-none text-sm"
          />
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-edge text-dim font-mono">ESC</kbd>
        </div>

        {results.length > 0 && (
          <ul className="max-h-72 overflow-y-auto py-1">
            {results.map((r, i) => (
              <li key={r.slug}>
                <button
                  onClick={() => go(r.slug)}
                  className={`w-full text-left px-4 py-2.5 flex flex-col gap-0.5 transition-colors ${i === selected ? 'bg-elevated' : 'hover:bg-elevated/50'}`}
                >
                  <span className="text-sm font-medium text-heading">{r.title}</span>
                  <span className="text-xs text-muted line-clamp-1">{r.description}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim().length > 0 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted">No results for &ldquo;{query}&rdquo;</div>
        )}

        {query.trim().length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-dim">
            Start typing to search posts
          </div>
        )}
      </div>
    </div>
  );
}
