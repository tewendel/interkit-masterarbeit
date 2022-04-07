import { getProjectPath } from './filesystem.mjs'
import { gitCommitAll } from './git.mjs'
import { updateGit } from './updater.mjs'

const get_git_commitAll = async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = getProjectPath(projectId);
  const message = req.query.message;

  const commit = await gitCommitAll(projectPath, message)
  updateGit(projectId)

  res.send({
    projectId,
    commit,
    status: commit ? "OK" : "fail"
  })
}

export {
  get_git_commitAll
}