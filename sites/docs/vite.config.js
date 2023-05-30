import { sveltekit } from '@sveltejs/kit/vite';
import sveld from 'vite-plugin-sveld';
import ViteYaml from '@modyfi/vite-plugin-yaml';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), sveld(), ViteYaml()],
	clearScreen: false,
	optimizeDeps: {
		include: ['highlight.js', 'highlight.js/lib/core']
	}
};

export default config;
