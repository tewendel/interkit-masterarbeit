import { getProjectPath } from './filesystem.mjs'
import { gitLatestCommit } from './git.mjs'

const get_git_status = async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = getProjectPath(projectId);

  const commit = await gitLatestCommit(projectPath)

  res.send({
    projectId,
    commit,
    status: commit ? "OK" : "fail"
  })
}

export {
  get_git_status
}