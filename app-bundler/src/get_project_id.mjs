import * as path from 'path';
import { promises as fs } from 'fs';
import { promisify } from 'util';
import { resolveProjectPath } from './utils.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const get_project_id =  async (req, res) => {

  const projectSlug = req.params.projectSlug;
  const projectId = resolveProjectPath(projectSlug, res); // TODO use ./interkit_server/getProjectIdFromProjectSlug ?
  if(projectId) {
    try {
      res.send(projectId)
    } catch (error) {
      res.send(404)
    }
  }
}

export { get_project_id }