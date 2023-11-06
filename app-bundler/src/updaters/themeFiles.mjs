/*
 * Check the build directory and update the lastBuildDate 
 */

import { promises as fs } from "fs";
import path from "path";
import remarkFrontmatter from "remark-frontmatter";
import imgLinks from "@pondorasti/remark-img-links";
import remark from "remark";
import grayMatter from "gray-matter";
import interkit_server from "../interkit_server.mjs";
import { getProjectPath } from "../filesystem.mjs";

const INTERKIT_BUNDLER_URL = process.env.INTERKIT_BUNDLER_URL;

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

      //const absPathMarkdownDir = path.dirname(path.join(projectPath, file));
      const markdownProcessor = remark()
        .use(imgLinks, { absolutePath: INTERKIT_BUNDLER_URL + "/app/" + projectId + "/theme/" })
        .use(remarkFrontmatter, ["yaml"]);

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

      interkit_server.call("project.updateUiState", {
        projectId: projectId,
        section: "installedTheme",
        data: readmeResult,
      });
    }

    if (file ===  globalCssPath) {
        let result = null;
      try {
        const absPath = path.join(projectPath, globalCssPath);
        result = await fs.readFile(absPath, "utf8");
      } catch (err) {
        console.log(
          `global.css not found in project ${projectId} ${globalCssPath} ( -> probable no theme installed)`,
          err
        );
      }

      interkit_server.call("project.updateUiState", {
        projectId: projectId,
        section: "globalCssContent",
        data: result,
      });
    }

  });

};

export { updateTheme };
