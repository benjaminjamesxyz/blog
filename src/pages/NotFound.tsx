import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold mb-4 text-dim">404</h1>
      <p className="mb-8 text-muted">This page doesn&apos;t exist.</p>
      <Link
        to="/"
        className="font-medium text-accent hover:underline"
      >
        &larr; Back to blog
      </Link>
    </div>
  );
}
