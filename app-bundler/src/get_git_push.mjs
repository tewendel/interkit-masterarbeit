import { getProjectPath } from './filesystem.mjs'
import { gitPush } from './git.mjs'
import { updateGit } from './updater.mjs'

const get_git_push = async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = getProjectPath(projectId);
  const remote = req.query.remote;

  let error, result

  try {
    result = await gitPush(projectPath, remote)
    updateGit(projectId)
  } catch (e) {
    error = e
    console.log(e)
  }

  res.send({
    projectId,
    status: result.ok && !result.error ? "OK" : "fail",
    result,
    error
  });
}

export {
  get_git_push
}