import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginMdx } from '@rsbuild/plugin-mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginMdx({
      mdxLoaderOptions: {
        remarkPlugins: [remarkFrontmatter, remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['anchor-icon'], ariaLabel: 'Link to section' }, content: { type: 'element', tagName: 'svg', properties: { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 }, children: [{ type: 'element', tagName: 'path', properties: { d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71' }, children: [] }, { type: 'element', tagName: 'path', properties: { d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71' }, children: [] }] } }],
          [rehypeKatex, { output: 'html' }],
          [
            rehypePrettyCode,
            { theme: 'github-dark', keepBackground: true },
          ],
        ],
      },
    }),
  ],
  source: {
    entry: {
      index: './src/entry.tsx',
    },
  },
  html: {
    title: 'Tech Blog',
    meta: {
      description: 'Technical blog about embedded systems, firmware, and low-level programming',
      viewport: 'width=device-width, initial-scale=1',
    },
    tags: [
      {
        tag: 'link',
        attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      },
      {
        tag: 'link',
        attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      },
      {
        tag: 'link',
        attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
      },
      {
        tag: 'link',
        attrs: { rel: 'alternate', type: 'application/atom+xml', href: '/rss.xml', title: 'Tech Blog RSS' },
      },
      {
        tag: 'meta',
        attrs: { property: 'og:site_name', content: 'Tech Blog' },
      },
    ],
  },
  output: {
    assetPrefix: '/',
    filename: {
      js: '[name].[contenthash:8].js',
      css: '[name].[contenthash:8].css',
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
});
