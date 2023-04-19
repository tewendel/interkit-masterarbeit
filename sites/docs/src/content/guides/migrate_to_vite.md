## Migrate interkit to vite (Apps before April 2023)

(See commit [
6dab1378](https://gitlab.interkit.app/interkit/interkit-experiments/-/commit/6dab1378f299f76aac7cd50a97bbb5dba097d73e))

### Rename

- rename `public` to `static`
- move `public/index.html` one up to `index.html`

### Add

- add `vite.config.js`:
```js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "./",
  publicDir: "static",
  server: {
    port: 8000
  },
  build: {
    outDir: "public",
    target: "es2015",
  },
})
```

### Delete

- delete `rollup.config.js`

### Modify

- `.gitignore`
```diff
-public/build/
+public/
```

- `index.html` in `<head>`:
```diff

-  <link rel='stylesheet' href='build/bundle.css'>
```

```diff
-  <script>
-    document.addEventListener('DOMContentLoaded', function() {
-      var src = (new URLSearchParams(window.location.search)).get('dev') ? 'build/bundle_dev.js' : 'build/bundle.js'
-      var scriptTag = document.createElement('script');
-      scriptTag.setAttribute('defer', true);
-      scriptTag.setAttribute('src', src);
-      document.head.appendChild(scriptTag);
-    })
-  </script>
```
- `index.html` in `<body>`:
```diff
-  <div class="Loading" style="padding: 20px">laden...</div>
+  <div id="app"></div>
+  <script type="module" src="/src/main.js"></script>

```
- `package.json`

```diff
 "scripts": {
-    "build": "rollup -c",
+    "build": "vite build",
     "start": "sirv public",
-    "build:dev": "QUICK_COMPILE=true rollup -c",
-    "dev": "rollup -c -w"
+    "preview": "vite preview",
+    "build:dev": "npm run build",
+    "dev": "vite"
   },
```