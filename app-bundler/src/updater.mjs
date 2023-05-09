/* functions to watch projects files and update the project collection */

import path from 'path'
import match from 'minimatch'
import watch from 'node-watch'
import debounce from 'debounce'
import { promises as fs } from 'fs'
import { processMarkdown } from './projectmeta.mjs'

import { getProjectPath } from './filesystem.mjs'
import interkit_server from './interkit_server.mjs'
import { gitUnstagedChanges, gitLog, gitListRemotes, gitDiff } from "./git.mjs";

const watchedProjectIds = []

const watchedFileReMd = /^(project|readme|description)\.(md|markdown)$/i

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

const updateFileMd = (projectId, { path, filename, basename, extension }) => {
  console.log('updateFileMd', { path, filename, basename, extension })
  fs.readFile(path)
    .then(file => file.toString())
    .then(async mdStr => {
      const html = await processMarkdown(mdStr)
      interkit_server.call('project.updateUiState', {
        projectId: projectId, 
        section: 'metafile.' + basename.toLowerCase(),
        data: {
          md: mdStr,
          html: html || 'markdown error'
        }
      })
    })
    .catch(e => { console.error('updateFileMd error', { path, filename, basename, extension }, e) })
}

const processAllProjectFiles = async projectId => {
  const projectPath = getProjectPath(projectId)
  fs.readdir(projectPath)
    .then(allFiles => processProjectFiles(projectId, allFiles))
}

const processProjectFiles = async (projectId, files) => files.forEach(file => {
  const projectPath = getProjectPath(projectId)
  let matchMd = file.match(watchedFileReMd)
  if (matchMd) {
    const [filename, basename, extension] = matchMd
    const path = projectPath + '/' + filename
    updateFileMd(projectId, { path, filename, basename, extension })
  }
})

const updateFiles = async function(projectId, watchedFiles) {
  processProjectFiles(projectId, Object.keys(watchedFiles))
  interkit_server.call('project.updateUiState', {
    projectId: projectId, 
    section: 'files',
    data: watchedFiles
  })
}

const watchignore = [
  "**/node_modules/**",
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
  const updateProjectFilesDebounced = debounce( wF =>updateFiles(projectId, wF), 100)
  const updateGitDebounced = debounce(() => updateGit(projectId), 100)

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