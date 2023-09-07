import * as path from 'path';
import fs from 'fs'
import fse from 'fs-extra'
import git from 'isomorphic-git'

import { gitAddAll, gitAdd, gitCommit, gitCloneProject } from './git.mjs'
import { compile_project } from './get_compile.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH
const INTERKIT_BUNDLER_URL = process.env.INTERKIT_BUNDLER_URL
const INTERKIT_SERVER_WEBSOCKETS_URL = process.env.INTERKIT_SERVER_WEBSOCKETS_URL
const INTERKIT_SERVER_URL = process.env.INTERKIT_SERVER_URL
const INTERKIT_ADMIN_URL = process.env.INTERKIT_ADMIN_URL

function getProjectPath(projectId) {
  const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)
  return projectPath
}

// check if folders exist to for all projects and setup starter if they don't
async function ensureRepositories(projects) {
  //console.log("ensureRepositories", projects)
  for (let project of projects) {
    const projectId = project.id
    const projectPath = getProjectPath(projectId)
    if (!fs.existsSync(projectPath)) {
      // find source project id if this project duplicates an existing project
      const projectHistoryCreateEvents = project.history && Array.isArray(project.history) && project.history.filter(e => e.event === "create_project") || []
      const lastCreateEvent = projectHistoryCreateEvents[projectHistoryCreateEvents.length-1] || {}
      const sourceProjectId = lastCreateEvent?.props?.sourceProjectId
      const template = lastCreateEvent?.props?.template
      const gitRepository = lastCreateEvent?.props?.gitRepository
      if (sourceProjectId) {
        await duplicateRepository(project, sourceProjectId)
      } else {
        await setupNewRepository(project, template, gitRepository)
      }
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
    INTERKIT_ADMIN_URL,
  }
}

async function duplicateRepository(project, sourceProjectId) {
  const projectId = project.id
  const oldProjectPath = getProjectPath(sourceProjectId)
  const projectPath = getProjectPath(projectId)

  console.log(`duplicating project ${oldProjectPath} to ${projectPath}`)

  if (fs.existsSync(projectPath)) {
    console.warn("path already exists", projectPath)
    return
  }

  if (!fs.existsSync(oldProjectPath)) {
    console.warn("path noes not exist", oldProjectPath)
    return
  }

  // copy files

  try {
    fse.copySync(oldProjectPath, projectPath)
    console.log(`copied ${oldProjectPath} to ${projectPath}`)
  } catch (err) {
    console.warn(`copy failed: ${oldProjectPath} to ${projectPath}`)
    return
  }

  // adjust slug

  // generate new interkit.config (TODO: modify existing config) to connect with new project slug
  const interkitConfigJson = JSON.stringify(generateInterkitConfig(project), null, "  ")
  // ...and overwrite interkit.config
  await fs.promises.writeFile(
    path.join(projectPath, "static/interkit.config.json"),
    interkitConfigJson
  )
  // ...and commit
  await gitAdd(projectPath, "static/interkit.config.json")
  await gitCommit(projectPath, "generate new interkit.config.json because of project duplication")

}

async function setupNewRepository(project, template="starter", gitRepository) {
  const projectId = project.id
  
  const starterPath = process.env.REPOSITORIES_PATH + "/starters/" + template
  const projectPath = getProjectPath(projectId)
  const interkitConfigJson = JSON.stringify(generateInterkitConfig(project), null, "  ")

  console.log(`setup new project ${projectId} in ${projectPath}. \n ${interkitConfigJson}`)


  // create new directory and initialize repo
  try {
    if (!fs.existsSync(projectPath)) {
      await fs.promises.mkdir(projectPath);

      if (gitRepository) {
        console.log("clone new app from " + gitRepository)
        try {
          await gitCloneProject(projectPath, gitRepository)
        } catch (err) {
          console.error(err)
        }
      } else {
        await git.init({ fs, dir: projectPath });
        fse.copySync(starterPath, projectPath)
      }
      
      await fs.promises.writeFile(
        path.join(projectPath, "static/interkit.config.json"),
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

      await compile_project(projectId)

    } else {
      console.log("Directory already exists.");
    }
  } catch (err) {
    console.log(err);
  }
}

export {
  ensureRepositories,
  getProjectPath,
  generateInterkitConfig
}
