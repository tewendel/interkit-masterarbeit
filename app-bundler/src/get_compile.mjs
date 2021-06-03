import * as path from 'path';

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

import { promisify } from 'util';
import { exec } from 'child_process'

const execPromise = promisify(exec)

const get_compile =  async (req, res) => {

  const projectId = req.params.projectId;
  const dev = typeof(req.query.dev) !== "undefined";

  const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)

  const command_npm =       `cd ${projectPath} && npm install`
  const command_build =     `cd ${projectPath} && npm run build`
  const command_build_dev = `cd ${projectPath} && npm run build:dev`

  let code, message
  try {
    if (dev) {
      const result_build_dev = await execPromise(command_build_dev);
      message = result_build_dev?.stdout + result_build_dev?.stderr
    } else {
      const result_npm = await execPromise(command_npm);
      let [result_build, result_build_dev] = await Promise.all([
        execPromise(command_build),
        execPromise(command_build_dev)
      ])
      message = result_npm.stdout + result_npm.stderr + result_build_dev?.stdout + result_build_dev?.stderr + result_build?.stdout + result_build?.stderr
    }
    code = 0
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