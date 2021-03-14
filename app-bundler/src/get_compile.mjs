import * as path from 'path';

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

import { promisify } from 'util';
import { exec } from 'child_process'

const execPromise = promisify(exec)

const get_compile =  async (req, res) => {

  const projectId = req.params.projectId;

  const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)

  let code, message
  try {
    const result = await execPromise(`cd ${projectPath} && npm install && npm run build`);
    code = 0
    message = result.stdout + result.stderr
  } catch (error) {
    console.log("caught error", error)
    code = error.code
    message = error.stdout + error.stderr
  }

  console.log('message:', message);
  console.log('code:', code);

  if (code == 0) {
    res.send({ status: "ok", data: { message } })
  } else {
    res.send({ status: "error", data: { message } })
  }

}

export { get_compile }