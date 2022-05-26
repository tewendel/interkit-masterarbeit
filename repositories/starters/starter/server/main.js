import { setup } from 'interkit/interkit-connect.js';
import projectApi from 'interkit/project-api.js';
import { setupMessageHandling } from 'interkit/project-server.js';
import { readdirSync } from "fs";

/* get projectId */

const projectId = process.env.INTERKIT_PROJECT_ID
const [username, password] = String(process.env.INTERKIT_PROJECT_SERVER_SECRET).split(":")
// console.log("projectId: " + projectId)

/* import handlers */

const dir = "./handlers"
const handlers = {}
const files = readdirSync(dir).filter(file => file.substring(file.length - 3) === ".js")
for (let file of files) {

    let handler = await import(dir + "/" + file)
    handlers[file.substring(0, file.length - 3)] = handler
    // console.log(`imported ${file}`)
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
