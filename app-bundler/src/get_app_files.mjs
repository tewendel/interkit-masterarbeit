import { promises as fs } from 'fs';
import * as path from 'path';

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const get_app_files = async (req, res, next) => {
  //console.log("request", req.url)

  // TODO this is too easy to exploit

  const match = req.path.match(/\/app\/([a-zA-Z0-9]+)(.*)$/)

  
  // console.log("url, match", req.url, match)
  const projectId = match?.[1]
  let subpath = match?.[2] 

  if (match == null || !projectId) res.send(404)

  if(projectId) {  
    // console.log("projectId: " + projectId, "subpath: " + subpath)

    console.log("build projectPublicPath", REPOSITORIES_PATH, projectId)

    const projectPublicPath = path.join(REPOSITORIES_PATH, "projects", projectId, "public")

    console.log(req.url, projectId, subpath, projectPublicPath)

    if (subpath == "/" || subpath == "") {
      subpath = "/index.html"
    }

    const subpathArray = subpath.split("/")

    const filePath = path.join(projectPublicPath, ...subpathArray)

    console.log(filePath)

    try {
      const file = await fs.readFile(filePath)
      res.contentType(path.basename(filePath));
      res.send(file)
    } catch (error) {
      res.send(404)
    }
  }


  next();
}

export { get_app_files }