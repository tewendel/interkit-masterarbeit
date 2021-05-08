import git from 'isomorphic-git'
import fs from 'fs'

async function gitAddAll(projectPath) {
  const repo = {
    fs,
    dir: projectPath
  }
  await git.statusMatrix(repo).then((status) =>
    Promise.all(
      status.map(([filepath, , worktreeStatus]) =>
        worktreeStatus ? git.add({ ...repo, filepath }) : git.remove({ ...repo, filepath })
      )
    )
  )
}

async function gitLatestCommit(projectPath, branch = "master") {
  let commits = await git.log({
    fs,
    dir: projectPath,
    depth: 1,
  })
  const commit = commits[0]
  return {
    sha: commit.oid.substr(0,7),
    message: commit.commit.message
  }
}


export {
  gitAddAll,
  gitLatestCommit
}