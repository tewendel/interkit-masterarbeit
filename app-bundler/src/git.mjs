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

async function gitAdd(projectPath, filepath) {
  const repo = {
    fs,
    dir: projectPath
  }
  git.add({ ...repo, filepath })
}

async function gitCommit(projectPath, message = "some commit") {
  let sha = await git.commit({
    fs,
    dir: projectPath,
    author: {
      name: 'Interkit System',
      email: 'info@interkit.app',
    },
    message
  })
  return sha
}

async function gitLatestCommit(projectPath, branch = "master") {
  let commits = []
  try {
    commits = await git.log({
      fs,
      dir: projectPath,
      depth: 1,
    })
  } catch (error) {
    console.warn(error)
  }
  const commit = commits[0]
  return {
    sha: commit ? commit.oid.substr(0,7) : "0",
    message: commit ? commit.commit.message : "(error)"
  }
}


export {
  gitAddAll,
  gitLatestCommit,
  gitAdd,
  gitCommit
}