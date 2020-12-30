import express from 'express';
const app = express();

import { rollup } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

app.use(express.static('public', {index: false}))

// compile a bundle for a given app
app.get('/compile/:bundleId', async (req, res) => {

  const bundleId = req.params.bundleId;

  // todo: add options to check out repo at different stages
  
  // make the bundle (adapted from rollup.config.js in svelte template)
  const bundle = await rollup({
    input: '../repositories/' + bundleId + '/main.js',
    plugins: [
      svelte({
        compilerOptions: {
          // enable run-time checks when not in production
          dev: false
        }
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: 'bundle.css' }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      terser()
    ]      
  })

  const outputOptions = {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/' + bundleId + '/bundle.js'
  }
  await bundle.write(outputOptions)

  res.send("ok")

});


// serve a bundle for a given app
app.get('/app/:bundleId', (req, res) => {

  // wrap it in html page
  const renderPage = (bundleKey) => { return `
  <!doctype html>
  <html>
  <head>
    <link rel='stylesheet' href='/build/${bundleKey}/bundle.css'>  
  </head>
  <body>
    <div id="app"></div>
    <script src='/build/${bundleKey}/bundle.js'></script>
  </body>
  </html>
  ` }

    res.send(renderPage(req.params.bundleId));
});

app.listen(4000, () => console.log('listening on port 4000')); 

