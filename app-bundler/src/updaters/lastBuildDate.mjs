/*
 * Check the build directory and update the lastBuildDate 
 */

import { promises as fs } from "fs";
import interkit_server from "../interkit_server.mjs";
import { getProjectPath } from "../filesystem.mjs";

const buildDirName = "public";

const updateLastBuildDate = async function (projectId, watchedFiles) {
  // check if there is any changed file starting with buildDirName
  const found = Object.keys(watchedFiles).some((file) => {
    if (file.startsWith(buildDirName)) {
      return true;
    }
  });

  if (found) {
    const dir = getProjectPath(projectId) + "/" + buildDirName;
    const timestamp = await fs.stat(dir).then((stat) => stat.mtimeMs);
    const date = new Date(timestamp);
    console.log("updateLastBuild", projectId, date);
    interkit_server.call("project.updateUiState", {
      projectId,
      section: "lastBuildDate",
      data: date,
    });
  }
};

export { updateLastBuildDate };
