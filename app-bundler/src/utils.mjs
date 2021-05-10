import interkit_server from './interkit_server.mjs'

const projectIdRegex = /[a-zA-Z0-9]+/
const projectSlugRegex = /[a-zA-Z0-9\-_]+/

const validateProjectId = (projectId) => {
  return (projectId && projectId.match(projectIdRegex) !== null)
}

const validateProjectSlug = (projectSlug) => {
  return (projectSlug && projectSlug.match(projectSlugRegex) !== null)
}

const resolveProjectPath = (slug, res) => {
  // TODO validate slug across system
  let projectId = false
  if (validateProjectSlug(slug)) {
    projectId = interkit_server.getProjectIdFromProjectSlug(slug)
  }
  if (!projectId) projectId = slug
  if (validateProjectId(projectId)) {
    return projectId
  } else {
    if (res) res.sendStatus(404)
    return false
  }
}

export {
  validateProjectId,
  resolveProjectPath,
  projectSlugRegex,
}