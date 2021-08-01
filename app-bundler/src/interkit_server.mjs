import simpleDDP from 'simpleddp'; // ES6
import ws from 'isomorphic-ws';
import { ensureRepositories } from './filesystem.mjs'

const opts = {
  endpoint: process.env.INTERKIT_SERVER_SERVERSIDE_WEBSOCKETS_URL || process.env.INTERKIT_SERVER_WEBSOCKETS_URL,
  SocketConstructor: ws,
  reconnectInterval: 5000
};

let projects = []

const setup = async () => {

  console.log("connecting to " + opts.endpoint)

  const server = new simpleDDP(opts);

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
  });

  let projectsSub = server.subscribe("projects");

  await projectsSub.ready();

  let reactiveCollection = server.collection('projects').reactive();

  reactiveCollection.onChange((newData) => {
    ensureRepositories(newData)
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

export default {
  setup,
  getProjectIdFromProjectSlug
}