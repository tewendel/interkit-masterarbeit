import { defineMDSveXConfig as defineConfig } from 'mdsvex';

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

	remarkPlugins: [sveld],
	rehypePlugins: []
});

export default config;
