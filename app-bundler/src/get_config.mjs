import * as path from 'path';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { resolveProjectPath } from './utils.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const get_config =  async (req, res) => {

  const projectSlug = req.params.projectSlug;
  const projectId = resolveProjectPath(projectSlug, res);
  
  if(projectId) {
    const projectPublicPath = path.join(REPOSITORIES_PATH, "projects", projectId, "public")
    const filePath = projectPublicPath + "/interkit.config.json"
    console.log(filePath);

    try {
      const file = await fs.readFile(filePath);
      res.contentType(path.basename(filePath));
      res.send(file)
    } catch (error) {
      res.send(404)
    }
  }
}

export { get_config }