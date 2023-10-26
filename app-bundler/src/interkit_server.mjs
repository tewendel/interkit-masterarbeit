import { setup as serverSetup } from 'interkit/interkit-connect.js';
import { ensureRepositories } from './filesystem.mjs'
import { updateProjectServers } from './project_server.mjs'
import { runProjectUpdaters, runSystemUpdaters } from "./updater.mjs";
import { ensureViteServers } from './vite_server.mjs'
import { runMigrationsOncePerProject } from "./migration.mjs";
import { avoidParallelExecution } from "./utils.mjs";

let projects = []
let server = null

const setup = async (app, main_server) => {

  server = await serverSetup({},{
    username: "bundler",
    password: process.env.BUNDLER_PASSWORD
  })

  server.on('login', async () => {

    let reactiveCollection = server.collection('projects').reactive();

    console.log("running system updaters")
    await runSystemUpdaters()

    reactiveCollection.onChange( avoidParallelExecution(async (newData) => {
      projects = newData;
      await ensureRepositories(newData)
      await runMigrationsOncePerProject(newData);
      updateProjectServers(newData)
      runProjectUpdaters(newData);
      ensureViteServers(newData, app, main_server)
    }));

    let projectsSub = server.subscribe("projects");
  })
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