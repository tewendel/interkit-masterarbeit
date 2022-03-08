import { getProjectPath } from './filesystem.mjs'
import { gitCheckout } from './git.mjs'
import { updateGit } from './updater.mjs'

const get_git_checkout = async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = getProjectPath(projectId);

  const gitResult = await gitCheckout(projectPath)
  updateGit(projectId)

  res.send({
    projectId,
    status: gitResult ? "OK" : "fail"
  })
}

export {
  get_git_checkout
}