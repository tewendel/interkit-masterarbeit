/*
 * send file structure of a project to server
 */

import interkit_server from "../interkit_server.mjs";

const updateProjectDirFiles = (projectId, watchedFiles) => {
  interkit_server.call("project.updateUiState", {
    projectId: projectId,
    section: "files",
    data: watchedFiles,
  });
};

export { updateProjectDirFiles };
