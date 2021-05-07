import * as path from 'path';
import fs from 'fs'
import fse from 'fs-extra'
import git from 'isomorphic-git'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH
const INTERKIT_BUNDLER_URL = process.env.INTERKIT_BUNDLER_URL
const INTERKIT_SERVER_WEBSOCKETS_URL = process.env.INTERKIT_SERVER_WEBSOCKETS_URL
const INTERKIT_SERVER_URL = process.env.INTERKIT_SERVER_URL

function getProjectPath(projectId) {
  const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)
  return projectPath
}

// check if folders exist to for all projects and setup starter if they don't
function ensureRepositories(projects) {
  console.log(projects)
  for (let project of projects) {
    const projectId = project.id
    const projectPath = getProjectPath(projectId)
    if (!fs.existsSync(projectPath)) {
      setupNewRepository(project)
    }
  }
}

function generateInterkitConfig(project) {
  return {
    project_slug: project.slug || "",
    bundle_version: "0.1",
    INTERKIT_APP_LOAD_THEME: true,
    INTERKIT_BUNDLER_URL,
    INTERKIT_SERVER_WEBSOCKETS_URL,
    INTERKIT_SERVER_URL,
  }
}

async function setupNewRepository(project) {
  const projectId = project.id
  
  const starterPath = process.env.REPOSITORIES_PATH + "/starters/cs1"
  const projectPath = getProjectPath(projectId)
  const interkitConfigJson = JSON.stringify(generateInterkitConfig(project), null, "  ")

  console.log(`setup new project ${projectId} in ${projectPath}. \n ${interkitConfigJson}`)


  // create new directory and initialize repo
  try {
    if (!fs.existsSync(projectPath)) {
      await fs.promises.mkdir(projectPath);
      await git.init({ fs, dir: projectPath });
      await fse.copySync(starterPath, projectPath)
      await fs.promises.writeFile(
        path.join(projectPath, "public/interkit.config.json"),
        interkitConfigJson
      )

      await gitAddAll(projectPath)

      let sha = await git.commit({
        fs,
        dir: projectPath,
        author: {
          name: 'Interkit System',
          email: 'info@interkit.app',
        },
        message: 'Initial commit'
      })
      console.log(`initial commit: ${sha}`)

    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
}

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

export {
  ensureRepositories,
  getProjectPath,
  generateInterkitConfig
}