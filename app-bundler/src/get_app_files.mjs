import { promises as fs } from 'fs';
import * as path from 'path';
import { resolveProjectPath } from './utils.mjs'
import interkit_server from './interkit_server.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const get_app_files = async (req, res, next) => {

  if (req.path.startsWith("/dev/")) {
  next('route');
  return
  }
  // TODO this is too easy to exploit

  const match = req.path.match(/\/app\/([a-zA-Z0-9]{17})(.*)$/)

  //console.log("request", req.path, req.url, match);

  const defaultProject = interkit_server.getDefaultProject()

  if (match == null && !defaultProject) {
    res.sendStatus(404)
    next();
    return;
  }

  const slugOrId = match?.[1] || defaultProject.id
  let subpath = match?.[2] || req.path


  const projectId = resolveProjectPath(slugOrId)

  //console.log("request, found project", projectId, subpath);
  // console.log("url, match", req.url, match)

  if(projectId) {  
    // console.log("projectId: " + projectId, "subpath: " + subpath)

    //console.log("build projectPublicPath", REPOSITORIES_PATH, projectId)

    const projectPublicPath = path.join(REPOSITORIES_PATH, "projects", projectId, "public")

    //console.log("request, projectPublicPath", projectPublicPath)

    if (subpath == "/" || subpath == "") {
      subpath = "/index.html"
    }

    const subpathArray = subpath.split("/")

    const filePath = path.join(projectPublicPath, ...subpathArray)

    //console.log(filePath)

    try {
      const file = await fs.readFile(filePath)
      res.contentType(path.basename(filePath));
      res.send(file)
      next();
    } catch (error) {
      res.sendStatus(404)
      next();
    }
  } else {
    res.sendStatus(404)
    next();
  }
  
}

export { get_app_files }