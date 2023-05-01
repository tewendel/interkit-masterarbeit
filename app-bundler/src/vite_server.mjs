import { getProjectPath } from './filesystem.mjs'

import { initCluster, addWorker, removeWorker } from "./clusterproxy.mjs";


const workers = [];

let initialized = false;

async function ensureViteServers(projects, app, server) {

  if (!initialized) {
    initCluster({
      app,
      server,
      settings: {
        exec: "viteworker.mjs",
      },
      portrange: [3011, 3400],
    });
    initialized = true;
  }
  
  // add new servers
  for (const project of projects) {
    if (!workers.find((worker) => worker.id === project.id)) {
      const worker = addWorker({
        id: project.id,
        pathPrefix: "dev/" + project.id,
        env: {
          PROJECT_PATH: getProjectPath(project.id),
        },
      });
      workers.push(worker);
    }
  }
}

export { 
  ensureViteServers
}