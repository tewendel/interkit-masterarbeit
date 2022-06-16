import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as io from 'socket.io';
import http from 'http';

import { get_compile } from './src/get_compile.mjs'
import { get_bundle_zip } from './src/get_bundle_zip.mjs'
import { get_config } from './src/get_config.mjs'
import { get_local_config } from './src/get_local_config.mjs'
import { get_project_id } from './src/get_project_id.mjs'
import { get_app_files } from './src/get_app_files.mjs'
import { setup_cloudcmd } from './src/cloudcmd.mjs'
import interkit_server from './src/interkit_server.mjs'
import { get_git_status } from './src/get_git_status.mjs'
import { get_git_commitAll } from './src/get_git_commitAll.mjs'
import { get_git_checkout } from './src/get_git_checkout.mjs'
import { get_yamls } from './src/get_yamls.mjs'

import { api as board_node_api } from 'interkit/project-boards-nodes.js'

import { api as project_files_api } from './src/api_project_files.mjs'

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

// get a interkit.config.json for a given app
app.get('/localConfig/:projectSlug', get_local_config)

// get projectId for a fiven project slug
app.get('/project_id/:projectSlug', get_project_id)

// compile a bundle for a given app
app.get('/compile/:projectId', get_compile)

// git 
app.get('/git/status/:projectId', get_git_status)
app.get('/git/commitAll/:projectId', get_git_commitAll) // a method that triggers a change
app.get('/git/checkout/:projectId', get_git_checkout) // a method that triggers a change


// get component configuration yamls
app.get('/components/:projectId', get_yamls)

// app.use(express.urlencoded({ extended: true }))

const rawBodyParser = bodyParser.raw({ type: '*/*' })
app.get('/boards/:projectId', board_node_api.boards.list)
app.post('/boards/:projectId/:boardId', board_node_api.boards.create)
app.get('/boards/:projectId/:boardId', board_node_api.boards.read)
app.put('/boards/:projectId/:boardId', rawBodyParser, board_node_api.boards.update)
app.delete('/boards/:projectId/:boardId', board_node_api.boards.delete)
app.put('/boards/:projectId/:boardId/renamenode/:oldNodeId/:newNodeId', board_node_api.boards.renameNode)

// dont need it, build it into read board
// app.get('/boards/:projectId/:boardId/nodes', board_node_api.nodes.list)
app.post('/boards/:projectId/:boardId/nodes/:nodeId', rawBodyParser, board_node_api.nodes.create)
app.get('/boards/:projectId/:boardId/nodes/:nodeId', board_node_api.nodes.create)
app.put('/boards/:projectId/:boardId/nodes/:nodeId', rawBodyParser, board_node_api.nodes.update)
app.delete('/boards/:projectId/:boardId/nodes/:nodeId', board_node_api.nodes.delete)


// src files
app.post('/src/:projectId/:filename', rawBodyParser, project_files_api.update)
app.get('/src/:projectId/:filename', project_files_api.read)
app.put('/src/:projectId/:filename', rawBodyParser, project_files_api.update)
app.delete('/src/:projectId/:filename', project_files_api.delete)



//app.use(express.static('public', { index: false }))


// get app public files
app.use(get_app_files);


server.listen(PORT, () => console.log('listening on port ' + PORT)); 

