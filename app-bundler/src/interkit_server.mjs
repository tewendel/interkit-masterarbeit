import { setup as serverSetup } from 'interkit/interkit-connect.js';
import { ensureRepositories } from './filesystem.mjs'
import { updateProjectServers } from './project_server.mjs'
import { runUpdaters } from './updater.mjs'

let projects = []
let server = null

const setup = async () => {

  server = await serverSetup({},{
    username: "bundler",
    password: process.env.BUNDLER_PASSWORD
  })
  
  let projectsSub = server.subscribe("projects");

  await projectsSub.ready();

  let reactiveCollection = server.collection('projects').reactive();

  reactiveCollection.onChange( async (newData) => {
    await ensureRepositories(newData)
    updateProjectServers(newData)
    runUpdaters(newData)
    projects = newData
  });
}

const getProjectIdFromProjectSlug = (slug) => {
  const project = projects.find( p => (p.slug && (p.slug !== "" && p.slug === slug || p.name !== '' && p.name === slug)) )
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