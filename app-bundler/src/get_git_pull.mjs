import { getProjectPath } from './filesystem.mjs'
import { gitPull } from './git.mjs'
import { updateGit } from './updater.mjs'

const get_git_pull = async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = getProjectPath(projectId);
  const remote = req.query.remote;

  const success = await gitPull(projectPath, remote)
  updateGit(projectId)

  res.send({
    projectId,
    status: success ? "OK" : "fail"
  })
}

export {
  get_git_pull
}