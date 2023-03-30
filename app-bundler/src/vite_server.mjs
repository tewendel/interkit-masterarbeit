import { createServer as createViteServer, searchForWorkspaceRoot} from 'vite'
import { getProjectPath } from './filesystem.mjs'

export async function setupViteServer(app, projectId) {

  // Mount the Vite middleware onto the "/apps/exampleapp" path
  const vite = await createViteServer({
    root: getProjectPath(projectId),
    //mode: 'development',
    //appType: 'custom',
    server: {
      middlewareMode: true,
      //appType: 'custom',
      //base: "/server.base",
      fs: {
        allow: [
          // search up for workspace root
          //searchForWorkspaceRoot("/Users/holger/Documents/Projekte/interkit/code/interkit-experiments/"),
          "/Users/holger/Documents/Projekte/interkit/code/interkit-experiments/packages/interkit/",
          ".",
        ],
      },
    },
    base: "/dev/" + projectId + "/",
    // file prefix for the dev server
    
    // Vite configuration options
  })

  /*
  TODO: use https://vitejs.dev/guide/api-plugin.html#handlehotupdate 
  to send a message over meteor instead of using the websocket
  */

  console.log("setupViteServer", process.cwd() )

  app.use('/dev/' + projectId, vite.middlewares)
}
