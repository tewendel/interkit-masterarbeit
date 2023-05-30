/*
 * Check markdown files 
 */

import { promises as fs } from "fs";
import { processMarkdown } from "../projectmeta.mjs";
import interkit_server from "../interkit_server.mjs";
import { getProjectPath } from "../filesystem.mjs";

const watchedFileReMd = /^(project|readme|description)\.(md|markdown)$/i;

const updateFileMd = (projectId, { path, filename, basename, extension }) => {
  console.log("updateFileMd", { path, filename, basename, extension });
  fs.readFile(path)
    .then((file) => file.toString())
    .then(async (mdStr) => {
      const html = await processMarkdown(mdStr);
      interkit_server.call("project.updateUiState", {
        projectId: projectId,
        section: "metafile." + basename.toLowerCase(),
        data: {
          md: mdStr,
          html: html || "markdown error",
        },
      });
    })
    .catch((e) => {
      console.error(
        "updateFileMd error",
        { path, filename, basename, extension },
        e
      );
    });
};

const updateProjectMdFiles = async (projectId, files) =>
  files.forEach((file) => {
    const projectPath = getProjectPath(projectId);
    let matchMd = file.match(watchedFileReMd);
    if (matchMd) {
      const [filename, basename, extension] = matchMd;
      const path = projectPath + "/" + filename;
      updateFileMd(projectId, { path, filename, basename, extension });
    }
  });

export { updateFileMd, updateProjectMdFiles };
