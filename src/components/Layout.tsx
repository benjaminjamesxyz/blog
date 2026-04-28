import { Outlet, Link } from 'react-router-dom';

export default function Layout({ onSearchOpen }: { onSearchOpen: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-base text-primary">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-base focus:rounded focus:text-sm focus:font-medium">Skip to content</a>
      <header className="sticky top-0 z-50 backdrop-blur-sm border-b border-edge bg-base/85">
        <div className="max-w-[72rem] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-heading hover:text-accent transition-colors"
          >
            Tech Blog
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={onSearchOpen}
              className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-edge hover:border-muted"
              aria-label="Search posts (Ctrl+K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-edge text-dim font-mono ml-2">⌘K</kbd>
            </button>
            <a
              href="/rss.xml"
              className="p-1.5 text-muted hover:text-primary transition-colors"
              aria-label="RSS feed"
              title="RSS feed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6.18" cy="17.82" r="2.18" />
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 w-full max-w-[72rem] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-edge">
        <div className="max-w-[72rem] mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-sm text-muted">
          <span>&copy; {new Date().getFullYear()} Tech Blog</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              Built with <span className="font-medium text-primary">Rsbuild</span>
            </span>
            <a
              href="https://github.com/benjaminjamesxyz/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>Edit on GitHub</span>
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
