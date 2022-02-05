import simpleDDP from 'simpleddp'; // ES6
import ws from 'isomorphic-ws';
import { ensureRepositories } from './filesystem.mjs'
import { updateProjectServers } from './project_server.mjs'

const opts = {
  endpoint: process.env.INTERKIT_SERVER_SERVERSIDE_WEBSOCKETS_URL || process.env.INTERKIT_SERVER_WEBSOCKETS_URL,
  SocketConstructor: ws,
  reconnectInterval: 5000
};

let projects = []
let server = null

const setup = async () => {

  console.log("connecting to " + opts.endpoint + "...")

  server = new simpleDDP(opts);

  server.on('connected', () => {
    // do something
    console.log("connected to interkit server")
  });

  server.on('disconnected', () => {
    // for example show alert to user
    console.log("disconnected from interkit server")
  });

  server.on('error', (e) => {
    // global errors from server
    console.log("interkit server error", e)
  });

  let projectsSub = server.subscribe("projects");

  await projectsSub.ready();

  let reactiveCollection = server.collection('projects').reactive();

  reactiveCollection.onChange((newData) => {
    ensureRepositories(newData)
    updateProjectServers(newData)
    projects = newData
  });
}

const getProjectIdFromProjectSlug = (slug) => {
  const project = projects.find( p => (p.slug && p.slug != "" && p.slug === slug) )
  if (project) {
    return project.id
  } else {
    return false
  }
}

const getDefaultProject = () => {
  return projects.find(p => p.isDefaultProject) || false
}

const call = (method, params) => {
  return server.call(method, params)
}

export default {
  setup,
  getProjectIdFromProjectSlug,
  getDefaultProject,
  call
}