import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../generated/posts';
import PostCard from '../components/PostCard';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function HomePage() {
  useDocumentHead({ path: '/' });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-heading">
          Blog
        </h1>
        <p className="mt-2 text-muted">
          Thoughts on embedded systems, firmware, and low-level programming.
        </p>
        {allTags.length > 0 && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-dim">Browse by topic:</span>
            {allTags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${encodeURIComponent(tag)}`}
                className="text-sm px-3 py-1 rounded-full font-medium bg-edge text-tag hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="py-8 text-muted">No posts yet. Check back soon.</p>
      ) : (
        <div className="divide-y divide-edge">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
