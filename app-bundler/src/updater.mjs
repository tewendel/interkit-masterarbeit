/* functions to watch projects files and update the project collection */

import match from 'minimatch'
import watch from 'node-watch'

import { getProjectPath } from './filesystem.mjs'
import interkit_server from './interkit_server.mjs'
import {
  gitUnstagedChanges
} from './git.mjs'

const watchedProjectIds = []

const updateGit = async function(projectId) {
  const projectPath = getProjectPath(projectId)
  const data = {
    unstagedChanges: await gitUnstagedChanges(projectPath),
  }
  interkit_server.call('project.updateUiState', {
    projectId: projectId, 
    section: 'git',
    data
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
    // console.log('file %s of project %s changed.', filename, projectId);
    updateGit(projectId)
  });
}

const runUpdaters = async function(projects) {
  for (let project of projects) {
    await runUpdater(project.id)
  }
}

export {
  runUpdaters,
}