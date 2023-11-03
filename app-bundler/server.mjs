import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as io from 'socket.io';
import http from 'http';

import { getThemesPath } from "./src/filesystem.mjs";
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
import { get_git_push } from "./src/get_git_push.mjs";
import { get_git_pull } from "./src/get_git_pull.mjs";
import { get_yamls } from './src/get_yamls.mjs'
import { get_readme } from './src/get_readme.mjs'
import { get_themes_apply } from './src/get_themes_apply.mjs'
import { get_themes_remove } from './src/get_themes_remove.mjs'

import { api as board_node_api } from 'interkit/project-boards-nodes.js'

import { api as project_files_api } from './src/api_project_files.mjs'

const PORT = process.env.PORT

const cloudcmd_prefix = '/fs/';

const app = express();

const server = http.createServer(app);

// handle error
server.on('error', (e) => {
  console.log("bundler http server error caught", e)
})

interkit_server.setup(app, server);

const socket = new io.Server(server, {
  path: `${cloudcmd_prefix}socket.io`,
});

app.use(cloudcmd_prefix, setup_cloudcmd(socket));

const corsOptions = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

app.use(cors(corsOptions))

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
app.get('/git/push/:projectId', get_git_push)
app.get('/git/pull/:projectId', get_git_pull)


// get component configuration yamls
app.get('/components/:projectId', get_yamls)

// app.use(express.urlencoded({ extended: true }))

const rawBodyParser = bodyParser.raw({ type: '*/*', limit: '50mb' })
app.get('/boards/:projectId', board_node_api.boards.list)
app.post('/boards/:projectId/:boardId', board_node_api.boards.create)
app.get('/boards/:projectId/:boardId', board_node_api.boards.read)
app.put('/boards/:projectId/:boardId', rawBodyParser, board_node_api.boards.update)
app.patch('/boards/:projectId/:boardId', rawBodyParser, board_node_api.boards.patch)
app.delete('/boards/:projectId/:boardId', board_node_api.boards.delete)
app.put('/boards/:projectId/renameboard/:oldBoardId/:newBoardId', board_node_api.boards.renameBoard)
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

// readme / docs
// TODO remove if unnecessary
app.get('/readme/:projectId', get_readme)

// themes
app.get('/themes/:themeSlug', get_themes_apply)
app.get("/themes/", get_themes_remove);
app.use("/themes/", express.static(getThemesPath(), { index: false }));

//app.use(express.static('public', { index: false }))

// get app public files
//app.get("/app/*", get_app_files);
app.get("/*", get_app_files);

server.listen(PORT, () => console.log('listening on port ' + PORT)); 

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  // Handle or clean up code here
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Handle or clean up code here
});