import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	kit: {
		adapter: adapter(),
		vite: {
			optimizeDeps: {
				include: ["highlight.js", "highlight.js/lib/core"],
			},
		},
	},

	preprocess: [mdsvex(mdsvexConfig)]
};

export default config;
