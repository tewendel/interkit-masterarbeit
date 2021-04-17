const validateProjectId = (projectId) => {
  const projectIdRegex = /[a-zA-Z0-9]+/
  return (projectId && projectId.match(projectIdRegex) !== null)
}

export {
  validateProjectId
}