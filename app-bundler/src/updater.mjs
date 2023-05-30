/* functions to watch projects files and update the project collection */

import path from 'path'
import match from 'minimatch'
import watch from 'node-watch'
import debounce from 'debounce'
import { promises as fs } from 'fs'

import { getProjectPath } from './filesystem.mjs'

import { updateLastBuildDate } from "./updaters/lastBuildDate.mjs";
import { updateGit } from "./updaters/gitFiles.mjs";
import { updateProjectMdFiles } from "./updaters/mdFiles.mjs";
import { updateProjectDirFiles } from "./updaters/projectFiles.mjs";

const watchedProjectIds = []

const processAllProjectFiles = async projectId => {
  const projectPath = getProjectPath(projectId)
  fs.readdir(projectPath)
    .then(allFiles => updateProjectMdFiles(projectId, allFiles))
}

const watchignore = [
  "**/node_modules/**",
  "**/node_modules/.*",
  "**/.git/**",
  "**/ios/**",
  "**/android/**",
  "**/vite.config.js.timestamp-*",
];

const runUpdater = async function(projectId) {
  // make sure the project is watched only once
  if (watchedProjectIds.includes(projectId)) return false
  watchedProjectIds.push(projectId)

  // prepare tracking files
  const watchedFiles = {}

  // prepare updater methods
  const updateProjectDirFilesDebounced = debounce( wF =>updateProjectDirFiles(projectId, wF), 100)
  const updateProjectMdFilesDebounced = debounce( wF => updateProjectMdFiles(projectId, Object.keys(wF)), 100);
  const updateGitDebounced = debounce(() => updateGit(projectId), 100)
  const updateLastBuildDateDebounced = debounce(
    (wF) => updateLastBuildDate(projectId, wF),
    500
  );

  // watch project path and trigger updaters
  const projectPath = getProjectPath(projectId)

  processAllProjectFiles(projectId)

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
    // collecting files as this functions runs for each file
    watchedFiles[file] = Date.now()
    // trigger debounced updaters
    updateGitDebounced()
    //updateProjectDirFilesDebounced(watchedFiles) // not used yet
    updateProjectMdFilesDebounced(watchedFiles)
    updateLastBuildDateDebounced(watchedFiles);
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