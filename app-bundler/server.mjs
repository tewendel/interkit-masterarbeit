import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors())

import { rollup } from 'rollup';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import yaml from '@rollup/plugin-yaml';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import auto from '@rollup/plugin-auto-install'

import { promises as fs } from 'fs';
import * as path from 'path';

app.use(express.static('public', {index: false}))

// compile a bundle for a given app
app.get('/compile/:projectId', async (req, res) => {

  const projectId = req.params.projectId;

  let error;
  
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
      auto(),
      nodeResolve({
        browser: true,
        //dedupe: ['svelte'],
        moduleDirectories: ['../../app-bundler/node_modules'] // relative to input file!
      }),
      commonjs(),
      terser(),
      yaml()
    ]      
  }).catch((compileError) => {
    console.log("rollup compile error", compileError);
    console.log("message", compileError.message);
    error = compileError;
  })

  if(bundle) {

    const directory = 'public/build/' + projectId
    await fs.rmdir(directory, { recursive: true })

    const outputOptions = {
      sourcemap: true,
      format: 'es', //iife
      name: 'app',
      //file: 'public/build/' + projectId
      dir: 'public/build/' + projectId
    }

    await bundle.write(outputOptions).catch((writeError)=> {
      console.log("bundle write error", writeError)
      error = writeError
    })
    
  }

  if(!error) {
    res.send({status: "ok"})
  } else {
    res.send({status: "error", data: {...error, message: error.message}})
  }

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
    <script>
      window.onerror = function (msg, source, lineNo, columnNo, error) {
         // function to execute error handling
         window.parent.postMessage({msg, source, lineNo, columnNo}, "*")
         return false
      }
    </script>
    <script type='module' src='/build/${projectId}/main.js'></script>
  </body>
  </html>
  ` }

    res.send(renderPage(req.params.projectId));
});

app.listen(4000, () => console.log('listening on port 4000')); 

