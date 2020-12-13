const express = require('express');
const app = express();

const svelte = require('svelte/compiler');

const rollup = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');

// our svelte component - could be pulled from db 
let dynamicComponentSource = `
      <script>
        let foo = "bar"
        console.log(Meteor)
       </script>
      <h1>hello {foo}</h1>
`

// compile it and bunddle it together with dependencies loaded from node_modules
let outputBundle;

const doBundling = async () => {
  const bundle = await rollup.rollup({
        input: "./DynamicComponent.svelte", // entrypoint for bundling - in this case our dynamic component
        plugins: [
          {
            name: "repl-plugin",
            async resolveId(importee, importer) {
              if(importee == "./DynamicComponent.svelte" )
                return importee  // just pass through our dynamic component
              else           
                return "node_modules/" + importee + "/index.mjs" // for other modules build paths
            },
            async load(id) {
              if(id == "./DynamicComponent.svelte") 
                return dynamicComponentSource; // return source from memory             
              else
                return null // this leads to default behaviour (load other modules from file)
            },
            transform(code, id) {
              // our only transform is to compile svelte components
              if (/.*\.svelte/.test(id)) return svelte.compile(code).js.code;
            },
          },
        ],
      });

  outputBundle = (await bundle.generate({ format: "esm" })).output[0].code;
  //console.log(outputBundle);
}

doBundling();

// wrap it in html page
const renderPage = () => { return `
<!doctype html>
<html>
  <head>
    <script src="/meteor-client.js"></script>
    <script type="module"> 
      ${outputBundle} 
      new Component({ target: document.body })
    </script>
  </head>
  <body></body>
</html>
` }

// respond to client requests
app.get('/', (req, res) => {
    res.send(renderPage());
});

app.use(express.static('public'))

app.listen(4000, () => console.log('listening on port 4000')); 