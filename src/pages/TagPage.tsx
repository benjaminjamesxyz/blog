import { useParams, Link } from 'react-router-dom';
import { posts } from '../generated/posts';
import PostCard from '../components/PostCard';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const decodedTag = tag ? decodeURIComponent(tag) : '';
  const filtered = posts.filter((p) => p.tags.includes(decodedTag));

  useDocumentHead({
    title: `Posts tagged "${decodedTag}"`,
    path: tag ? `/tag/${tag}` : undefined,
  });

  return (
    <div>
      <div className="mb-10">
        <Link
          to="/"
          className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          &larr; Back to blog
        </Link>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-heading">
          Posts tagged &lsquo;{decodedTag}&rsquo;
        </h1>
        <p className="mt-2 text-muted">
          {filtered.length} post{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-muted">No posts found with this tag.</p>
      ) : (
        <div className="divide-y divide-edge">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
