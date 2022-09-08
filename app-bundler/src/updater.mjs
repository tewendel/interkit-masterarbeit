/* functions to watch projects files and update the project collection */

import path from 'path'
import match from 'minimatch'
import watch from 'node-watch'
import debounce from 'debounce'

import { getProjectPath } from './filesystem.mjs'
import interkit_server from './interkit_server.mjs'
import { gitUnstagedChanges, gitLog, gitListRemotes, gitDiff } from "./git.mjs";

const watchedProjectIds = []

const updateGit = async function(projectId) {
  const projectPath = getProjectPath(projectId)
  const data = {
    unstagedChanges: await gitUnstagedChanges(projectPath),
    log: await gitLog(projectPath),
    remotes: await gitListRemotes(projectPath),
  }
  interkit_server.call('project.updateUiState', {
    projectId: projectId, 
    section: 'git',
    data
  })
}

const updateFiles = async function(projectId, watchedFiles) {
  interkit_server.call('project.updateUiState', {
    projectId: projectId, 
    section: 'files',
    data: watchedFiles
  })
}

const watchignore = [
  '**/node_modules/**',
  '**/.git/**',
]

const runUpdater = async function(projectId) {
  // make sure the project is watched only once
  if (watchedProjectIds.includes(projectId)) return false
  watchedProjectIds.push(projectId)

  // prepare tracking files
  const watchedFiles = {}

  // prepare updater methods
  const updateProjectFilesDebounced = debounce( wF =>updateFiles(projectId, wF), 100)
  const updateGitDebounced = debounce(() => updateGit(projectId), 100)

  // watch project path and trigger updaters
  const projectPath = getProjectPath(projectId)

  watch(projectPath, {
    recursive: true,
    delay: 500,
    filter(f, skip) {
      for (let pattern of watchignore) {
        if (match(f, pattern)) {
          return skip
        }
      }
      return true
    }
  }, function(event, filename) {
    const file = path.relative(projectPath, filename)
    // console.log('file %s of project %s changed.', file, projectId)
    watchedFiles[file] = Date.now()
    updateGitDebounced()
    updateProjectFilesDebounced(watchedFiles)
  });
}

const runUpdaters = async function(projects) {
  for (let project of projects) {
    await runUpdater(project.id)
  }
}

export {
  runUpdaters,
  updateGit,
}