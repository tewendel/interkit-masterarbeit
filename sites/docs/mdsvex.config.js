import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import highlighter from './src/util/codeHighlighter.js';
import relativeImages from 'mdsvex-relative-images';
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// mermaid not working yet, see 
// - https://github.com/pngwn/MDsveX/issues/304
// - https://github.com/pngwn/MDsveX/issues/93
import { remarkMermaid } from 'remark-mermaidjs';

import sveld from "mdsvex-sveld";

const config = defineConfig({
	extensions: ['.svelte.md', '.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	highlight: {
		highlighter
	},

	remarkPlugins: [sveld, relativeImages, remarkToc],
	rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
});

export default config;
