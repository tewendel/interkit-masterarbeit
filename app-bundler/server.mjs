import express from 'express';
import cors from 'cors';
import * as io from 'socket.io';
import http from 'http';

import { get_compile } from './src/get_compile.mjs'
import { get_bundle_zip } from './src/get_bundle_zip.mjs'
import { get_config } from './src/get_config.mjs'
import { get_project_id } from './src/get_project_id.mjs'
import { get_app_files } from './src/get_app_files.mjs'
import { put_duplicate_project } from './src/put_duplicate_project.mjs'
import { setup_cloudcmd } from './src/cloudcmd.mjs'
import interkit_server from './src/interkit_server.mjs'

const PORT = process.env.PORT

const cloudcmd_prefix = '/fs/';

interkit_server.setup()

const app = express();

const server = http.createServer(app);
const socket = new io.Server(server, {
  path: `${cloudcmd_prefix}socket.io`,
});

app.use(cloudcmd_prefix, setup_cloudcmd(socket));

app.use(cors())

app.use(express.static('public', {index: false}))

// get a zip file of the bundle for a given app
app.get('/bundlezip/:projectId', get_bundle_zip)

// get a interkit.config.json for a given app
app.get('/config/:projectSlug', get_config)

// get projectId for a fiven project slug
app.get('/project_id/:projectSlug', get_project_id)

// compile a bundle for a given app
app.get('/compile/:projectId', get_compile)

// duplicate app repository
app.put('/app/:projectId', put_duplicate_project)
//app.use(express.static('public', { index: false }))


// get app public files
app.use(get_app_files);


server.listen(PORT, () => console.log('listening on port ' + PORT)); 

