import { getProjectPath } from './filesystem.mjs'
import { gitCheckout, gitClean } from "./git.mjs";
import { updateGit } from './updater.mjs'

const get_git_checkout = async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = getProjectPath(projectId);

  const gitResultCheckout = await gitCheckout(projectPath)
  const gitResultClean = await gitClean(projectPath)

  const gitResult = gitResultCheckout && gitResultClean
  
  updateGit(projectId)

  res.send({
    projectId,
    status: gitResult ? "OK" : "fail"
  })
}

export {
  get_git_checkout
}