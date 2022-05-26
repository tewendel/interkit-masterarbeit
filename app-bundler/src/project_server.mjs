// manage project servers
import fs from 'fs'
import process from 'process';
import { spawn } from 'child_process';
import { getProjectPath } from "./filesystem.mjs"
import interkit_server from "./interkit_server.mjs"

let servers = []

// react to change in projects
async function updateProjectServers(projects) {
  await ensureProjectServers(projects)
  // check actions
  for (let project of projects) {
    const action = project?.projectServer?.actionRequested
    if (action) {
      const projectId = project.id
      if (action == "start") {
        console.log("start")
        startServer(projectId)
      }
      if (action == "stop") {
        console.log("stop")
        stopServer(projectId)
      }
      interkit_server.call("project.projectServer.resetRequestedAction", { projectId })
    }
  } 
}

// make sure that all project servers are defined
async function ensureProjectServers(projects) {
  // console.log(projects)
  for (let project of projects) {
    const projectId = project.id
    const projectPath = getProjectPath(projectId)
    const serverPath = projectPath + "/server"
    if (fs.existsSync(serverPath)) {
      const server = servers.find(s => s.projectId === projectId)
      if (!server) {
        if (project.projectServer) {
          // setup & start project server
          startServer(projectId)
        } else {
          // initalize project server
          console.log(`initializing project server for project ${projectId}`)
          const result = await interkit_server.call("project.projectServer.init", { projectId })
          console.log(result)
          // setup & start project server
          // startServer(projectId) <-- will get trigeered by ensureProjectServers on the next run (NOTE: may crash if there is another change, needs improvements)
        }
      }
    }
  }
}

async function setupServerProcess(projectId) {
  const userCredentials = await interkit_server.call("user.registerProjectServerUser", { projectId })
  const projectPath = getProjectPath(projectId)
  const serverPath = projectPath + "/server"
  console.log(`running projectServer process for project ${projectId}`)
  const proc = spawn('nodemon', ['npm', 'start'], {
    cwd: serverPath,
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'], // enable IPC
    env: {
      ...process.env,
      INTERKIT_PROJECT_ID: projectId,
      INTERKIT_PROJECT_SERVER_SECRET: userCredentials.username + ":" + userCredentials.password
    }
  });
  interkit_server.call("project.projectServer.setStatus", { projectId, status: "running" })
  proc.stdout.on('data', (data) => {
    console.log(`projectServer ${projectId} stdout: ${data}`);
    interkit_server.call("project.projectServer.addMessage", { projectId, message: {
      type: "stdout",
      text: data.toString()
    }})
  });
  proc.stderr.on('data', (data) => {
    console.log(`projectServer ${projectId} stderr: ${data}`);
    interkit_server.call("project.projectServer.addMessage", { projectId, message: {
      type: "stderr",
      text: data.toString()
    }})
  });
  proc.on('close', (code) => {
    const server = servers.find(s => s.projectId === projectId)
    delete server.proc
    console.log(`projectServer ${projectId} exited with code ${code}`);
    interkit_server.call("project.projectServer.setStatus", { projectId, status: "stopped" })
    interkit_server.call("project.projectServer.addMessage", { projectId, message: {
      type: "system",
      text: `exited with code ${code}`
    }})
  });
  proc.on('message', function (event) {
    if (event.type === 'start') {
      console.log('nodemon started');
      interkit_server.call("project.projectServer.setStatus", { projectId, status: "running" })
    } else if (event.type === 'crash') {
      console.log('script crashed for some reason');
      interkit_server.call("project.projectServer.setStatus", { projectId, status: "crashed" })
    }
    //console.log('message', event);
  });
  return proc
}

async function startServer(projectId) {
  const server = servers.find(s => s.projectId === projectId)
  if (!server) {
    servers.push({
      projectId,
      proc: setupServerProcess(projectId).then(proc => proc) // put promise in proc (so it evalueates true in the next run, then replace it with the proc)
    })
  } else {
    if (server.proc) {
      console.warn(`projectServer ${projectId} already running`)
    }
    else {
      server.proc = setupServerProcess(projectId).then(proc => proc) // put promise in proc (so it evalueates true in the next run, then replace it with the proc)
    }
  }
}

function stopServer(projectId) {
  const server = servers.find(s => s.projectId === projectId)
  if (server && server.proc) {
    console.log(`stopping projectServer ${projectId}`)
    const terminated = server.proc.kill('SIGINT');
    // note: the process may still exist https://nodejs.org/api/child_process.html#subprocesskilled
    if (terminated) {
      console.log(`termianted projectServer ${projectId}`)
    }
  }
}

process.on('exit', (code) => {
  console.log("exiting: terminating projectServers")
  for (let server of servers) {
    stopServer(server.projectId)
  }
});

export {
  updateProjectServers
}