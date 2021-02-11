import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors())

import { rollup } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import yaml from '@rollup/plugin-yaml';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

app.use(express.static('public', {index: false}))

// compile a bundle for a given app
app.get('/compile/:projectId', async (req, res) => {

  const projectId = req.params.projectId;

  // todo: add options to check out repo at different stages
  
  // make the bundle (adapted from rollup.config.js in svelte template)
  const bundle = await rollup({
    input: '../repositories/projects/' + projectId + '/main.js',
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
      terser(),
      yaml()
    ]      
  })

  const outputOptions = {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/' + projectId + '/bundle.js'
  }
  await bundle.write(outputOptions)

  res.send("ok")

});


// serve a bundle for a given app
app.get('/app/:projectId', (req, res) => {

  // wrap it in html page
  const renderPage = (projectId) => { return `
  <!doctype html>
  <html>
  <head>
    <link rel='stylesheet' href='/build/${projectId}/bundle.css'>  
  </head>
  <body>
    <div id="app"></div>
    <script src='/build/${projectId}/bundle.js'></script>
  </body>
  </html>
  ` }

    res.send(renderPage(req.params.projectId));
});

app.listen(4000, () => console.log('listening on port 4000')); 

