import { sveltekit } from '@sveltejs/kit/vite';
import sveld from 'vite-plugin-sveld';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), sveld()],
	optimizeDeps: {
		include: ['highlight.js', 'highlight.js/lib/core']
	}
};

export default config;
