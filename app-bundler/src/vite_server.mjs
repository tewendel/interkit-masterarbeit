import { getProjectPath } from './filesystem.mjs'
import path from 'path'

import { initCluster, addWorker, removeWorker } from "./clusterproxy.mjs";

// absolute path to ../packages/interkit
const interkitPath = path.resolve(
  path.join(process.cwd(), "..", "packages", "interkit")
);

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
      portrange: [10000, 11000],
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
          INTERKIT_PATH: interkitPath,
        },
      });
      workers.push(worker);
    }
  }

  // remove old servers
  for (const worker of workers) {
    if (!projects.find((project) => project.id === worker.id)) {
      removeWorker(worker.id);
      workers.splice(workers.indexOf(worker), 1);
    }
  }
}

export { 
  ensureViteServers
}