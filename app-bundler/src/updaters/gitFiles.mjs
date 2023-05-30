/*
 * Update git related data per project
 */

import { getProjectPath } from "../filesystem.mjs";
import {
  gitUnstagedChanges,
  gitLog,
  gitListRemotes,
  gitDiff,
} from "../git.mjs";
import interkit_server from "../interkit_server.mjs";

const updateGit = async function (projectId) {
  const projectPath = getProjectPath(projectId);
  const data = {
    unstagedChanges: await gitUnstagedChanges(projectPath),
    log: await gitLog(projectPath),
    remotes: await gitListRemotes(projectPath),
  };
  interkit_server.call("project.updateUiState", {
    projectId: projectId,
    section: "git",
    data,
  });
};

export { updateGit };
