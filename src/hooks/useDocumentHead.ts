import { useEffect } from 'react';

const SITE_NAME = 'Tech Blog';

export function useDocumentHead({
  title,
  description,
  path,
}: {
  title?: string;
  description?: string;
  path?: string;
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || 'Technical blog about embedded systems, firmware, and low-level programming';
    const createdElements = new Set<HTMLElement>();

    document.title = fullTitle;

    const setMeta = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, property);
        document.head.appendChild(el);
        createdElements.add(el);
      }
      el.content = content;
    };

    setMeta('description', desc);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', desc, true);
    setMeta('og:type', 'article', true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);

    let canonicalLink: HTMLLinkElement | null = null;

    if (path) {
      const url = `https://blog.benjaminjames.xyz${path}`;
      setMeta('og:url', url, true);

      canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
        createdElements.add(canonicalLink);
      }
      canonicalLink.href = url;
    }

    return () => {
      for (const el of createdElements) {
        el.remove();
      }
      document.title = SITE_NAME;
    };
  }, [title, description, path]);
}

export function useJsonLd(data: Record<string, unknown> | null) {
  useEffect(() => {
    if (!data) return;
    let script = document.getElementById('json-ld') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'json-ld';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => { script.remove(); };
  }, [data]);
}
