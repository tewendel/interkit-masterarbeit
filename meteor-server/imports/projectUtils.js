import { Random } from 'meteor/random'
import { Projects, Sheets, Rows } from './collections.js';
import { getMediaFiles, duplicateProjectFile } from './mediaServer.js'

require('dotenv').config({
  path: `${process.env.PWD}/.env`
})

// see also: https://github.com/sebastianquack/interkit/blob/master/api/src/dbutil.js#L693


duplicateProject = async function (projectId) {
  const newProjectId = Random.id()
  console.log("duplicating project " + projectId + " to " + newProjectId)
  let projectData = await getAllOfProject(projectId)

  console.log(projectData)

  // determine new name
  const newProjectName = "Copy of " + projectData.project.name

  // duplicate files
  let newProjectFiles = []
  for (file of projectData.files) {
    const newFile = await duplicateProjectFile(file._id, newProjectId)
    newProjectFiles.push(newFile)
  }

  // transform ids and assemble new data object
  const newProjectData = transformProjectData(projectData, newProjectId, newProjectName)

  // change slug
  const newProjectSlug = newProjectData.project.slug + "_" + newProjectId
  newProjectData.project.slug = newProjectSlug

  // start new history
  newProjectData.project.history = [
    makeProjectHistoryEntry("create_project", {
      sourceProjectId: projectId,
    })
  ]

  // insert docs
  // uses https://github.com/mikowals/batch-insert
  if (newProjectData.rows.length > 0) Rows.batchInsert(newProjectData.rows)
  if (newProjectData.sheets.length > 0) Sheets.batchInsert(newProjectData.sheets)
  
  /* problem: this throws an error 
      reason: newProjectData.project.uiState.files contains "." characters in keys. 
   */
  // for now do not duplicate uiState
  newProjectData.project.uiState = undefined;

  console.log("newProjectData", newProjectData.project.history)

  Projects.insert(newProjectData.project)

  console.log("inserted project")

  return newProjectId
}

const transformProjectData = function(projectData, newProjectId, newProjectName=false) {
  // transform ids and assemble new data object
  if (!newProjectName) newProjectName = projectData.project.name
  const newProjectData = {
    project: { ...projectData.project, _id: newProjectId, name: newProjectName },
    sheets: projectData.sheets.map(sheet => ({ ...sheet, projectId: newProjectId, _id: Random.id() })),
    rows: projectData.rows.map(row => ({ ...row, projectId: newProjectId, _id: Random.id() })),
  }
  return newProjectData
}

export const addImportHistoryToProject = (projectId, meta) => {

}

export const replaceProjectData = function (projectData, projectId, meta) {
  const newProjectData = transformProjectData(projectData, projectId)

  // remove existing stuff
  Sheets.remove({ projectId })
  Rows.remove({ projectId })

  // inset docs
  // uses https://github.com/mikowals/batch-insert
  if (newProjectData.sheets.length > 0) Sheets.batchInsert(newProjectData.sheets)
  if (newProjectData.rows.length > 0) Rows.batchInsert(newProjectData.rows)
  addImportHistoryToProject(projectId, meta)
}

export const importProjectData = function (projectData, newProjectName, newProjectId, meta) {
  const newProjectData = transformProjectData(projectData, newProjectId, newProjectName)
  // add meta
  newProjectData.project.importHistory = newProjectData.project.importHistory ? [
    ...newProjectData.project.imports,
    meta
  ] : [meta]

  // inset docs
  // uses https://github.com/mikowals/batch-insert
  if (newProjectData.rows.length > 0) Rows.batchInsert(newProjectData.rows)
  if (newProjectData.sheets.length > 0) Sheets.batchInsert(newProjectData.sheets)
  Projects.insert(newProjectData.project)
  addImportHistoryToProject(newProjectId, meta)
}

const getAllOfProject = async function (projectId)  {

  // get data, use lean() to get a plain array rather than mongoose objects
  const project = Projects.findOne({ _id: projectId })
  const sheets = Sheets.find({ projectId }).fetch()
  const rows = Rows.find({ projectId }).fetch()
  const files = getMediaFiles({ projectId }).fetch()

  return {
    project: {...project, uiState: undefined},
    sheets,
    rows,
    files
  }
}

const transformProjectIds = function(projectData, newProjectId) {
  return projectData
}

const makeProjectHistoryEntry = function(eventName, eventProps) {
  const historyEntry = {
    date: new Date(),
    event: eventName,
    props: eventProps,
  }
  return historyEntry
}

//duplicateProjectData()
//insertProjectData(data, doUpdates = false)

export {
  duplicateProject,
  getAllOfProject,
}