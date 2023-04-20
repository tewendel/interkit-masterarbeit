import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5000,
  },
  build: {
    rollupOptions: {
      external: [], 
    },
  },
  clearScreen: false,
  envPrefix: 'INTERKIT_',
})
