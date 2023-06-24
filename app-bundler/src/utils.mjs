import interkit_server from './interkit_server.mjs'

const projectIdRegex = /[a-zA-Z0-9]+/
const projectSlugRegex = /[a-zA-Z0-9\-_]+/

const validateProjectId = (projectId) => {
  return (projectId && projectId.match(projectIdRegex) !== null)
}

const validateProjectSlug = (projectSlug) => {
  return (projectSlug && projectSlug.match(projectSlugRegex) !== null)
}

const resolveProjectPath = (slug) => {
  // TODO validate slug across system
  let projectId = false
  if (validateProjectSlug(slug)) {
    projectId = interkit_server.getProjectIdFromProjectSlug(slug)
  }
  if (!projectId) projectId = slug
  if (validateProjectId(projectId)) {
    return projectId
  } else {
    //if (res) res.sendStatus(404)
    return false
  }
}

/**
 * Avoids parallel execution of a function.
 * If the function is called while it is already running, it will be called again after the first call has finished.
 * @param {async Function} fn
 * @returns {Function}
 * @example
 * const fn = async () => {
 *  await new Promise(resolve => setTimeout(resolve, 1000));
 * console.log('fn called');
 * };
 * const wrappedFn = avoidParallelExecution(fn);
 * wrappedFn();
 * wrappedFn();
 * wrappedFn();
 */
const avoidParallelExecution = (fn) => {
  let running = false;
  let runOnceMore = false;
  const wrappedFn = async (...args) => {
    if (running) {
      runOnceMore = true;
      return;
    }
    running = true;
    await fn(...args);
    running = false;
    if (runOnceMore) {
      runOnceMore = false;
      await wrappedFn(...args);
    }
  };
  return wrappedFn;
};

export {
  validateProjectId,
  resolveProjectPath,
  projectSlugRegex,
  avoidParallelExecution,
};