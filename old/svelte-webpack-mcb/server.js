const express = require('express');
const app = express();

app.use(express.static('public', {index: false}))

// wrap it in html page
const renderPage = (bundleKey) => { return `
<!doctype html>
<html>
<head>
  <link rel='stylesheet' href='global.css'>
  <link rel='stylesheet' href='${bundleKey}.css'>  
</head>
<body>
  <p>insert app below:</p>
  <div id="app"></div>
  <script src='${bundleKey}.js'></script>
</body>
</html>
` }

// respond to client requests
app.get('/', (req, res) => {
    res.send(renderPage("bundle"));
});

app.listen(4000, () => console.log('listening on port 4000')); 

