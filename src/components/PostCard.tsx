import { Link } from 'react-router-dom';
import type { PostMeta } from '../generated/posts';

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group py-6 first:pt-0 last:pb-0">
      <Link to={`/post/${post.slug}`} className="block">
        <h2 className="text-xl font-semibold text-heading group-hover:text-accent transition-colors leading-snug">
          {post.title}
        </h2>
      </Link>
      <time className="block mt-1.5 text-sm text-muted">
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      {post.description && (
        <p className="mt-2 text-primary leading-relaxed">
          {post.description}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tag/${encodeURIComponent(tag)}`}
              className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-edge text-tag hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
