



/******************/
/*** DEPRECATED ***/
/******************/

import * as path from 'path';
import fs from 'fs'
import fse from 'fs-extra'
import { validateProjectId } from './utils.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

import { promisify } from 'util';
import { exec } from 'child_process'

const execPromise = promisify(exec)

const put_duplicate_project = async (req, res) => {


  // get params

  const newProjectId = req.params.projectId;
  const oldProjectId = req.query.from;

  if (!validateProjectId(newProjectId) || !validateProjectId(oldProjectId)) {
    res.sendStatus(400);
    console.warn("invalid request", req)
    return
  }

  console.log(`duplicating ${oldProjectId} to ${newProjectId}`);

  // get paths

  const newProjectPath = path.join(REPOSITORIES_PATH, "projects", newProjectId)
  const oldProjectPath = path.join(REPOSITORIES_PATH, "projects", oldProjectId)

  if (fs.existsSync(newProjectPath)) {
    res.sendStatus(500);
    console.warn("path already exists", newProjectPath)
    return
  }

  if (!fs.existsSync(oldProjectPath)) {
    res.sendStatus(500);
    console.warn("path noes not exist", oldProjectPath)
    return
  }

  // copy files

  try {
    fse.copySync(oldProjectPath, newProjectPath)
    console.log(`copied ${oldProjectPath} to ${newProjectPath}`)
  } catch (err) {
    res.sendStatus(500);
    console.warn(`copy failed: ${oldProjectPath} to ${newProjectPath}`)
    return
  }

  res.send({ status: "ok" })

}

export { put_duplicate_project }