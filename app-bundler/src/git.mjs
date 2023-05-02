import git from 'isomorphic-git'
import fs from 'fs'
import http from 'isomorphic-git/http/node//index.cjs'
import * as Diff from "diff"
import { TREE, WORKDIR, STAGE } from "isomorphic-git";


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

async function gitListRemotes(projectPath) {
  return await git.listRemotes({
    fs,
    dir: projectPath,
  })
}

async function gitAdd(projectPath, filepath) {
  const repo = {
    fs,
    dir: projectPath
  }
  git.add({ ...repo, filepath })
}

async function gitStatus(projectPath, filepath) {
  const repo = {
    fs,
    dir: projectPath
  }
  git.status({ ...repo, filepath })
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

async function gitCommitAll(projectPath, message = "some commit") {
  const files = await gitUnstagedChanges(projectPath)
  console.log("git commitAll:", files)
  for (let file of files) {
    const status = await gitStatus(projectPath, file);
    if (status === '*deleted') {
      // TODO: fix staging of removed file
      // https://github.com/isomorphic-git/isomorphic-git/issues/1042
      // https://github.com/isomorphic-git/isomorphic-git/issues/1099
        return git.remove({dir, file});
    }
    await gitAdd(projectPath, file)
  }
  return await gitCommit(projectPath, message)
}

async function gitCheckout(projectPath) {
  console.log("git checkout")
  const result =  await git.checkout({
    fs,
    dir: projectPath,
    force: true,
    ref: 'master'
  })
  console.log("git checkout:", result)
  return result
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

async function gitLog(projectPath, branch = "master") {
  let commits = []
  try {
    commits = await git.log({
      fs,
      dir: projectPath,
    })
  } catch (error) {
    console.warn(error)
  }
  return commits.map(entry => {
    return {
      ...entry,
      date: new Date(entry.commit.author.timestamp * 1000),
    }
  })
}

async function gitUnstagedChanges(projectPath) {
  const repo = {
    fs,
    dir: projectPath
  }
  const FILE = 0, WORKDIR = 2, STAGE = 3
  try {
    const filenames = (await git.statusMatrix(repo))
      .filter(row => row[WORKDIR] !== row[STAGE])
      .map(row => row[FILE])
      // console.log("unstaged changes:", filenames)
    return filenames;
  } catch (error) {
    console.warn(error)
    return false
  }
}

async function gitDiff(projectPath) {
  const A = TREE({ ref: 'HEAD' });
  const B = WORKDIR();

  // Get a list of the files that changed
  let changes = new Set();
  await git.walk({
    fs,
    dir: projectPath,
    trees: [A, B],
    map: async function (filename, [A, B]) {
      //if ((await A.type()) === "tree") return;
      if (!A) return
      if (!B) return

      let Aoid = new TextDecoder("utf-8").decode(await A?.content()) || ''
      let Boid = new TextDecoder("utf-8").decode(await B?.content()) || '';

      // Skip pairs where the oids are the same
      if (Aoid === Boid) return;

      changes.add({
        fullpath: filename,
        diff: Diff.diffChars(Aoid, Boid)
      });
    },
  });

  return Array.from(changes);
}

async function gitCloneProject(projectPath, url) {
  await git.clone({
    fs,
    dir: projectPath,
    http,
    url,
  })
}

async function gitPull(projectPath, remote) {
  await gitSetupUser(projectPath);
  return await git.pull({
    fs,
    http,
    dir: projectPath,
    remote,
    ref: "master",
    singleBranch: true,
  });
}

async function gitPush(projectPath, remote) {
  try {
    return await git.push({
      fs,
      http,
      dir: projectPath,
      remote,
      ref: "master",
      singleBranch: true,
    });
  } catch(error) {
    return false  
  }
}

async function gitSetupUser(projectPath, username = "interkit") {
  return await git.setConfig({
    fs,
    http,
    dir: projectPath,
    path: "user.name",
    value: username,
  });
}

export {
  gitAddAll,
  gitLatestCommit,
  gitAdd,
  gitCommit,
  gitCommitAll,
  gitCheckout,
  gitUnstagedChanges,
  gitLog,
  gitCloneProject,
  gitListRemotes,
  gitPull,
  gitPush,
  gitDiff,
};