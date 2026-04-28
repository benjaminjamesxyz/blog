import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import TagPage from './pages/TagPage';
import NotFound from './pages/NotFound';
import SearchDialog from './components/SearchDialog';
import { useState, useEffect, useCallback } from 'react';

function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const open = useCallback(() => setSearchOpen(true), []);
  const close = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {children(open)}
      <SearchDialog open={searchOpen} onClose={close} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        {(openSearch) => (
          <Routes>
            <Route element={<Layout onSearchOpen={openSearch} />}>
              <Route index element={<HomePage />} />
              <Route path="post/:slug" element={<PostPage />} />
              <Route path="tag/:tag" element={<TagPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        )}
      </SearchProvider>
    </BrowserRouter>
  );
}
