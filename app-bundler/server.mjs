import express from 'express';
const app = express();

import cors from 'cors';
app.use(cors())

import { rollup } from 'rollup';

import { promises as fs } from 'fs';
import * as path from 'path';

import { promisify } from 'util';
import {exec} from 'child_process'


const execPromise = promisify(exec)

const PORT = process.env.PORT
const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

app.use(express.static('public', {index: false}))

// compile a bundle for a given app
app.get('/compile/:projectId', async (req, res) => {

  const projectId = req.params.projectId;

  const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)

  let code, message
  try {
    const result = await execPromise(`cd ${projectPath} && npm install && npm run build`);
    code = 0
    message = result.stdout + result.stderr
  } catch(error) {
    console.log("caught error", error)
    code = error.code
    message = error.stdout + error.stderr
  }

  console.log('message:', message);
  console.log('code:', code);

  if ( code == 0 ) {
    res.send({status: "ok", data: {message}})
  } else {
    res.send({status: "error", data: {message}})
  }

});

//app.use(express.static('public', { index: false }))


app.use(async (req, res, next) => {
  console.log(req.url)

  // TODO this is too easy to exploit

  const match = req.url.match(/\/app\/([a-zA-Z0-9]+)(.*)$/)
  //console.log("url, match", req.url, match)
  const projectId = match?.[1]
  let subpath = match?.[2]

  if (match == null || !projectId) res.send(404)

  // console.log(match)

  const projectPublicPath = path.join(REPOSITORIES_PATH, "projects", projectId, "public")

  //console.log(req.url, projectId, subpath, projectPublicPath)

  if (subpath == "/" || subpath == "") {
    subpath = "/index.html"
  }

  const subpathArray = subpath.split("/")

  const filePath = path.join(projectPublicPath, ...subpathArray)

  console.log(filePath)

  try {
    const file = await fs.readFile(filePath)
    res.contentType(path.basename(filePath));
    res.send(file)
  } catch(error) {
    res.send(404)
  }

  

  next();
});


/*
// serve a bundle for a given app
app.get('/app/:projectId', async (req, res) => {

  // wrap it in html page
  const renderPage = async (projectId) => { 
    const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)
    const htmlPath = path.join(projectPath, "public", "index.html")
    const html = await fs.readFile(htmlPath)
    console.log(projectPath, htmlPath, html)
    return  html
  }

    res.send(await renderPage(req.params.projectId));
});
*/

app.listen(PORT, () => console.log('listening on port ' + PORT)); 

