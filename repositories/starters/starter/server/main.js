import { setup } from 'interkit/interkit-connect.js';
import projectApi from 'interkit/project-api.js';
import { setupMessageHandling, setupHookHandling } from 'interkit/project-server.js';
import { readdirSync } from "fs";

/* get projectId */

const projectId = process.env.INTERKIT_PROJECT_ID
const [username, password] = String(process.env.INTERKIT_PROJECT_SERVER_SECRET).split(":")
// console.log("projectId: " + projectId)

/* import handlers */

const handlersDir = "./handlers"
const handlers = {}
const handlersFiles = readdirSync(handlersDir).filter(file => file.substring(file.length - 3) === ".js")
for (let handlerFile of handlersFiles) {

    let handler = await import(handlersDir + "/" + handlerFile)
    handlers[handlerFile.substring(0, handlerFile.length - 3)] = handler
    // console.log(`imported ${file}`)
}

/* import hooks */

const hooksDir = './hooks'
const hooks = {}
const hooksFiles = readdirSync(hooksDir)
  .filter(file => file.endsWith('.js'))
for (let hookFile of hooksFiles) {
  console.log('project server, hooks, importing', hookFile)
  const hook = await import(`${hooksDir}/${hookFile}`)
  hooks[hookFile.substr(0, hookFile.length - 3)] = hook
}

/* setup server connection */

let server = await setup({},{
    username,
    password
})

/* setup message handling */

setupMessageHandling({
    handlers, 
    projectApi, 
    server, 
    projectId
})

/* setup hook handling */

setupHookHandling({
  hooks,
  projectApi, 
  server, 
  projectId
})
