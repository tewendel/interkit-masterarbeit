import * as path from 'path';
import fs from 'fs'
import fse from 'fs-extra'
import git from 'isomorphic-git'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

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

async function setupNewRepository(project) {
  const projectId = project.id
  console.log("setup new project " + projectId)
  
  const starterPath = process.env.REPOSITORIES_PATH + "/starters/cs1"
  const projectPath = getProjectPath(projectId)

  // create new directory and initialize repo
  try {
    if (!fs.existsSync(projectPath)) {
      await fs.promises.mkdir(projectPath);
      await git.init({ fs, dir: projectPath });
      await fse.copySync(starterPath, projectPath)

    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
}

export {
  ensureRepositories,
  getProjectPath
}