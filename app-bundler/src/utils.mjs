import interkit_server from './interkit_server.mjs'
import { promises as fs } from "fs";
import path from "path";
import match from "minimatch";
import frontmatter from "remark-frontmatter";
import remark from "remark";
import grayMatter from "gray-matter";

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

const getAllFilesRecursive = async (projectPath, ignorelist) => {

  const getAllFilesRecursive = async (dirPath, ignorelist) => {
    const allFiles = await fs.readdir(dirPath);
    let allFilesRecursive = [];

    mainloop: for (let file of allFiles) {
      const fullPath = path.join(dirPath, file);

      for (let pattern of ignorelist) {
        if (match(file, pattern)) {
          //console.log(`ignoring ${file} because of ${pattern}`);
          continue mainloop;
        }
      }

      const fileStats = await fs.stat(fullPath);
      if (fileStats.isDirectory()) {
        // If it's a directory, we recursively call getAllFilesRecursive
        const subFiles = await getAllFilesRecursive(fullPath, ignorelist);
        // Then we add each file in the sub directory to our final list, prepending the directory name
        allFilesRecursive = allFilesRecursive.concat(subFiles);
      } else {
        allFilesRecursive.push(fullPath);
      }
    }

    return allFilesRecursive;
  };

  return getAllFilesRecursive(projectPath, ignorelist);
};

async function extractFrontmatterAndContent(fileContent) {
  // Usage
  //
  // (async () => {
  //   const { frontMatterData, markdownContent } =
  //     await extractFrontmatterAndContent("path/to/your/file.md");
  //   console.log("Frontmatter Data:", frontMatterData);
  //   console.log("Markdown Content:", markdownContent);
  // })();
  try {
    let frontMatterData = {};
    let markdownContent = "";

    await new Promise((resolve, reject) => {
      remark()
        .use(frontmatter, { type: "yaml", marker: "-" })
        .process(fileContent, (err, file) => {
          if (err) reject(err);

    const parsed = grayMatter(String(file));

    console.log("Frontmatter data:", parsed.data);

          
          markdownContent = parsed.content;
          frontMatterData = parsed.data;
          resolve();
        });
    });

    return { frontMatterData, markdownContent };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export {
  validateProjectId,
  resolveProjectPath,
  projectSlugRegex,
  avoidParallelExecution,
  getAllFilesRecursive,
  extractFrontmatterAndContent,
};