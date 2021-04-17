import express from 'express';
import cors from 'cors';
import * as io from 'socket.io';
import http from 'http';

import { get_compile } from './src/get_compile.mjs'
import { get_bundle_zip } from './src/get_bundle_zip.mjs'
import { get_app_files } from './src/get_app_files.mjs'
import { put_duplicate_project } from './src/put_duplicate_project.mjs'
import { setup_cloudcmd } from './src/cloudcmd.mjs'

const PORT = process.env.PORT

const cloudcmd_prefix = '/fs/';

const app = express();

const server = http.createServer(app);
const socket = new io.Server(server, {
  path: `${cloudcmd_prefix}socket.io`,
});

app.use(cloudcmd_prefix, setup_cloudcmd(socket));


app.use(cors())

app.use(express.static('public', {index: false}))

// compile a bundle for a given app
app.get('/compile/:projectId', get_compile)

// get a zip file of the bundle for a given app
app.get('/bundlezip/:projectId', get_bundle_zip)

app.put('/app/:projectId', put_duplicate_project)
//app.use(express.static('public', { index: false }))

app.use(get_app_files);


server.listen(PORT, () => console.log('listening on port ' + PORT)); 

