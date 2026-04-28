import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const postsDir = path.join(rootDir, 'src', 'content', 'posts');
const outputDir = path.join(rootDir, 'src', 'generated');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const SITE_URL = process.env.SITE_URL || 'https://blog.benjaminjames.xyz';
const SITE_TITLE = 'Tech Blog';
const SITE_DESC = 'Technical blog about embedded systems, firmware, and low-level programming';

const mdxFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

const posts = mdxFiles
  .map((filename) => {
    const filePath = path.join(postsDir, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { content, data } = matter(raw);
    const slug = filename.replace(/\.(mdx|md)$/, '');
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime,
      content,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const metaOutput = [
  '// AUTO-GENERATED — DO NOT EDIT',
  '// Run: pnpm run build:content',
  '',
  'export interface PostMeta {',
  '  slug: string;',
  '  title: string;',
  '  date: string;',
  '  description: string;',
  '  tags: string[];',
  '  readingTime: number;',
  '}',
  '',
  `export const posts: PostMeta[] = ${JSON.stringify(posts.map(({ content, ...p }) => p), null, 2)};`,
  '',
  'export const postsMap: Record<string, PostMeta> = {',
  ...posts.map((p) => `  '${p.slug}': ${JSON.stringify({ slug: p.slug, title: p.title, date: p.date, description: p.description, tags: p.tags, readingTime: p.readingTime })},`),
  '};',
  '',
].join('\n');

const loadersOutput = [
  '// AUTO-GENERATED — DO NOT EDIT',
  '// Run: pnpm run build:content',
  '',
  "import type { ComponentType } from 'react';",
  '',
  'export const postLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {',
  ...posts.map((p) => `  '${p.slug}': () => import('../content/posts/${p.slug}.mdx'),`),
  '};',
  '',
].join('\n');

const searchEntries = posts.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  tags: p.tags.join(' '),
  content: p.content
    .replace(/^---[\s\S]*?---\n/m, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`>\[\]()!|_-]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .substring(0, 2000),
}));

const searchIndexOutput = [
  '// AUTO-GENERATED — DO NOT EDIT',
  '// Run: pnpm run build:content',
  '',
  `export const searchEntries = ${JSON.stringify(searchEntries, null, 2)};`,
  '',
].join('\n');

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const rssItems = posts.map((p) => `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${SITE_URL}/post/${p.slug}" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/post/${p.slug}</id>
    <updated>${new Date(p.date).toISOString()}</updated>
    <summary>${escapeXml(p.description)}</summary>
  </entry>`).join('\n');

const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_TITLE)}</title>
  <subtitle>${escapeXml(SITE_DESC)}</subtitle>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <link href="${SITE_URL}/rss.xml" rel="self" type="application/atom+xml"/>
  <id>${SITE_URL}</id>
  <updated>${new Date().toISOString()}</updated>
${rssItems}
</feed>`;

fs.writeFileSync(path.join(outputDir, 'posts.ts'), metaOutput);
fs.writeFileSync(path.join(outputDir, 'post-loaders.ts'), loadersOutput);
fs.writeFileSync(path.join(outputDir, 'search-index.ts'), searchIndexOutput);
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssFeed);

// Add unique tag pages to sitemap
const uniqueTags = [...new Set(posts.flatMap((p) => p.tags))];
const tagUrls = uniqueTags.map((tag) => ({
  loc: `${SITE_URL}/tag/${encodeURIComponent(tag)}`,
  changefreq: 'weekly',
}));

const sitemapUrls = [
  { loc: SITE_URL, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly' },
  ...posts.map((p) => ({
    loc: `${SITE_URL}/post/${p.slug}`,
    lastmod: new Date(p.date).toISOString().split('T')[0],
    changefreq: 'weekly',
  })),
  ...tagUrls,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

console.log(`Generated metadata for ${posts.length} post(s)`);
