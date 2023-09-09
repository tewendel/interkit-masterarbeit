import { getProjectPath } from './filesystem.mjs'
import path from 'path'
import interkit_server from "./interkit_server.mjs"

import { initCluster, addWorker, removeWorker } from "./clusterproxy.mjs";

// absolute path to ../packages/interkit
const interkitPath = path.resolve(
  path.join(process.cwd(), "..", "packages", "interkit")
);
console.log("interkitPath", interkitPath)

let workers;

let initialized = false;

async function ensureViteServers(projects, app, server) {

  if (!initialized) {
      workers = initCluster({
      app,
      server,
      settings: {
        exec: "viteworker.mjs",
      },
      portrange: [10000, 11000],
    });
    initialized = true;
  }

  const activeProjects = projects.filter((project) => project?.devServer?.actionRequested == "start")
  
  // add new servers
  for (const project of activeProjects) {
    ensureWorker(project);
  }

  // remove old servers
  for (const worker of Object.values(workers)) {
    const project = activeProjects.find((project) => project.id === worker.id);
    if (!project) {
      //console.log("removing old worker", worker.id);
      removeWorker(worker.id);
    }
  }
}

function ensureWorker(project) {
  if (
    !Object.values(workers).find(
      (worker) =>
        worker.id === project.id &&
        worker.isConnected() &&
        !worker.isDead() &&
        !worker.beingKilled
    )
  ) {
    //console.log("adding new worker", project.id);
    const worker = addWorker({
      id: project.id,
      pathPrefix: "dev/" + project.id,
      env: {
        PROJECT_PATH: getProjectPath(project.id),
        INTERKIT_PATH: interkitPath,
      },
    });
    worker.on("message", (msg) => {
      if (msg.type === "ready") {
        interkit_server.call("project.viteServer.setStatus", {
          projectId: project.id,
          status: "running",
        });
      }
    });
    worker.on("exit", (code, signal) => {
      interkit_server.call("project.viteServer.setStatus", {
        projectId: project.id,
        status: "dead",
        message: `exited with code: ${code} and signal: ${signal}`,
      });
    });
  }
}

export { 
  ensureViteServers
}