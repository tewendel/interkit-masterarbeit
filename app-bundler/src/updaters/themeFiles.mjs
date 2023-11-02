/*
 * Check the build directory and update the lastBuildDate 
 */

import { promises as fs } from "fs";
import path from "path";
import remarkFrontmatter from "remark-frontmatter";
import remark from "remark";
import grayMatter from "gray-matter";
import interkit_server from "../interkit_server.mjs";
import { getProjectPath } from "../filesystem.mjs";


const markdownProcessor = remark().use(remarkFrontmatter, ["yaml"]);
const tokensFilePath = path.join("src", "styleTokens.json");
const themeReadmePath = path.join("static", "theme", "README.md");
const globalCssPath = path.join("static", "theme", "global.css");

const updateTheme = async function (projectId, watchedFiles) {
  
  const projectPath = getProjectPath(projectId);
  
  Object.keys(watchedFiles).forEach(async (file) => {

    // style tokens (must be present and valid json)
    if (file === tokensFilePath) {
      try {
        const absPath = path.join(projectPath, file);
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

    // theme readme (may not be present)
    // and theme global css (may be present)
    if (file === themeReadmePath) {
      
      let readmeResult = null;
      try {
        const absPath = path.join(projectPath, file);
        const readmeContent = await fs.readFile(absPath, "utf8");
        const processed = await markdownProcessor.process(readmeContent);
        const parsed = grayMatter(String(processed));
        readmeResult = {
          meta: parsed.data,
          readme: parsed.content,
        };
      } catch (err) {
        console.log(
          `README.md not found in project ${projectId} ${themeReadmePath} ( -> probable no theme installed)`,
          err
        );
      }

      let globalCssResult = null;
      try {
        const absPath = path.join(projectPath, globalCssPath);
        const globalCssContent = await fs.readFile(absPath, "utf8");
        globalCssResult = {globalCssContent};
      } catch (err) {
        console.log(
          `global.css not found in project ${projectId} ${globalCssPath} ( -> probable no theme installed)`,
          err
        );
      }

      const result =  readmeResult || globalCssResult ? {...readmeResult, ...globalCssResult} : null

      interkit_server.call("project.updateUiState", {
        projectId: projectId,
        section: "installedTheme",
        data: result,
      });

    }

  });

};

export { updateTheme };
