/*
 * Check the build directory and update the lastBuildDate 
 */

import { promises as fs } from "fs";
import path from "path";
import interkit_server from "../interkit_server.mjs";
import { getProjectPath } from "../filesystem.mjs";

const themeDir = [""];

const updateTheme = async function (projectId, watchedFiles) {
  
  const projectPath = getProjectPath(projectId);
  const tokensFile = path.join("src", ...themeDir, "styleTokens.json");

  Object.keys(watchedFiles).forEach(async (file) => {
    if (file === tokensFile) {
      try {
        const absPath = path.join(projectPath, ...themeDir, file);
        const content = await fs.readFile(absPath);
        const json = JSON.parse(content.toString());
        interkit_server.call("project.updateUiState", {
          projectId: projectId,
          section: "styleTokens",
          data: json,
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

};

export { updateTheme };
