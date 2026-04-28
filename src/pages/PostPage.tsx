import { useState, useEffect, useMemo, type ReactNode, type ComponentType } from 'react';
import { useParams, Link } from 'react-router-dom';
import { posts, postsMap } from '../generated/posts';
import { postLoaders } from '../generated/post-loaders';
import MermaidChart from '../components/MermaidChart';
import CopyButton from '../components/CopyButton';
import TableOfContents from '../components/TableOfContents';
import ReadingProgress from '../components/ReadingProgress';
import { Note, Tip, Warning, Caution } from '../components/Callout';
import ErrorBoundary from '../components/ErrorBoundary';
import SerialLog from '../components/SerialLog';
import Details from '../components/Details';
import { useDocumentHead, useJsonLd } from '../hooks/useDocumentHead';

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in (children as object)) {
    return extractText((children as { props: { children: ReactNode } }).props.children);
  }
  return '';
}

const mdxComponents = {
  pre: ({ children, ...props }: { children: ReactNode; [key: string]: unknown }) => {
    // rehype-pretty-code puts data-language on <code> child, not <pre>
    const codeChild = Array.isArray(children) ? children[0] : children;
    const codeLang =
      codeChild &&
      typeof codeChild === 'object' &&
      'props' in (codeChild as object)
        ? ((codeChild as { props: { 'data-language'?: string } }).props['data-language'])
        : undefined;
    const language = (props['data-language'] as string | undefined) ?? codeLang;

    if (language === 'mermaid') {
      return <MermaidChart chart={extractText(children)} />;
    }
    const codeText = extractText(children);
    return (
      <div className="relative group not-prose my-6">
        <div className="flex items-center justify-between px-4 py-1.5 text-xs text-muted font-mono select-none">
          {language && <span>{language}</span>}
          {!language && <span />}
          <CopyButton text={codeText} />
        </div>
        <pre
          {...props}
          className={`${props.className ?? ''} rounded-lg overflow-x-auto !p-4 text-sm leading-relaxed bg-surface`}
        >
          {children}
        </pre>
      </div>
    );
  },
  Note,
  Tip,
  Warning,
  Caution,
  SerialLog,
  Details,
};

function getAdjacent(slug: string) {
  const idx = posts.findIndex((p) => p.slug === slug);
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  };
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postsMap[slug] : undefined;
  const [Content, setContent] = useState<ComponentType<{ components?: typeof mdxComponents }> | null>(null);
  const [loading, setLoading] = useState(true);

  useDocumentHead({
    title: post?.title,
    description: post?.description,
    path: slug ? `/post/${slug}` : undefined,
  });

  const jsonLd = useMemo(() => {
    if (!post) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      description: post.description,
      author: { '@type': 'Organization', name: 'Tech Blog' },
    };
  }, [post]);

  useJsonLd(jsonLd);

  useEffect(() => {
    if (!slug) return;
    setContent(null);
    setLoading(true);

    const loader = postLoaders[slug];
    if (loader) {
      loader()
        .then((mod) => {
          setContent(() => mod.default);
          setLoading(false);
        })
        .catch(() => {
          setContent(null);
          setLoading(false);
        });
    } else {
      setContent(null);
      setLoading(false);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4 text-heading">Post not found</h1>
        <Link to="/" className="text-accent hover:underline">&larr; Back to blog</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 py-4">
        <div className="h-8 rounded w-3/4 bg-elevated" />
        <div className="h-4 rounded w-1/4 bg-elevated" />
        <div className="h-64 rounded mt-8 bg-elevated" />
      </div>
    );
  }

  const { prev, next } = slug ? getAdjacent(slug) : { prev: null, next: null };

  return (
    <>
      <ReadingProgress />
      <div className="flex gap-8">
        <article className="flex-1 min-w-0">
          <header className="mb-8 not-prose">
            <Link
              to="/"
              className="text-sm text-muted hover:text-accent transition-colors inline-flex items-center gap-1"
            >
              &larr; Back to blog
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3 text-heading">
              {post.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm flex-wrap text-muted">
              <time>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readingTime} min read</span>
              {post.tags.length > 0 && (
                <>
                  <span aria-hidden="true">&middot;</span>
                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/tag/${encodeURIComponent(tag)}`}
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-edge text-tag hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </header>
          <div className="prose max-w-none">
            {Content && <ErrorBoundary><Content components={mdxComponents} /></ErrorBoundary>}
          </div>

          {(prev || next) && (
            <nav className="not-prose mt-12 pt-6 border-t border-edge grid grid-cols-2 gap-4">
              {prev ? (
                <Link to={`/post/${prev.slug}`} className="group text-left">
                  <span className="text-xs text-muted group-hover:text-accent transition-colors">← Previous</span>
                  <span className="block text-sm font-medium text-heading group-hover:text-accent transition-colors mt-0.5">{prev.title}</span>
                </Link>
              ) : <div />}
              {next ? (
                <Link to={`/post/${next.slug}`} className="group text-right">
                  <span className="text-xs text-muted group-hover:text-accent transition-colors">Next →</span>
                  <span className="block text-sm font-medium text-heading group-hover:text-accent transition-colors mt-0.5">{next.title}</span>
                </Link>
              ) : <div />}
            </nav>
          )}
        </article>
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-20">
            <TableOfContents contentKey={slug} />
          </div>
        </aside>
      </div>
    </>
  );
}
