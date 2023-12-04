import {promises as fs} from "fs";
import path from "path";
import { getProjectsPath } from "./filesystem.mjs";
import InterkitServer from "./interkit_server.mjs";

const garbageCollectionInterval = 1000 * 60 * 10; // 10 minutes

// go through all directories in projects folder and remove those that are not in the projects collection
async function cleanupRemovedProjectsFiles() {
  let projectIds = [];
  try {
    projectIds = await InterkitServer.call("projects.get.all.ids");
  } catch (e) {
    console.log("cleanupRemovedProjectsFiles", e);
    return
  }

  // check if projectIds is an array
  if (!Array.isArray(projectIds)) {
    console.log("cleanupRemovedProjectsFiles", "projectIds is not an array", projectIds);
    return
  }

  // check if projectIds is empty just to make sure the system is working
  if (projectIds.length < 1) {
    return
  }

  const projectsPath = getProjectsPath();
  const files = await fs.readdir(projectsPath);
  for (let file of files) {
    // if file is no special
    if (file.indexOf(".") === -1) {
      // project id is the same as the folder name
      const projectId = file;
      if (!projectIds.includes(projectId)) {
        const folder = path.join(projectsPath, file);
        console.log("removing", folder);
        try {
          await fs.rm(folder, {recursive: true});
        } catch (e) {
          console.log("cleanupRemovedProjectsFiles", "error removing", file, e);
        }
      }
    }
  }
}

function startGarbageCollection() {
  console.log("starting garbage collection");
  setInterval(() => {
    console.log("running garbage collection");
    cleanupRemovedProjectsFiles}
    , garbageCollectionInterval);
}

export { startGarbageCollection };
