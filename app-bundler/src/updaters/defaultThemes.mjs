/*
 * Check the default themes that are shipped with interkit
 * Read their README.md, extract the metadata, and update the database
 */

import { promises as fs } from "fs";
import path from "path";
import interkit_server from "../interkit_server.mjs";
import { getThemesPath } from "../filesystem.mjs";
import remarkFrontmatter from "remark-frontmatter";
import remark from "remark";
import grayMatter from "gray-matter";

const markdownProcessor = remark().use(remarkFrontmatter, ["yaml"]);

async function getThemeMetadata(themesPath) {
  // read README.md files from each subdirectory of the themesPath directory
  const readmes = [];
  try {
    // Read the current directory
    const files = await fs.readdir(themesPath, { withFileTypes: true });

    // Filter out only the directories
    const dirs = files.filter((file) => file.isDirectory());

    // Read README.md from each subdirectory
    for (const dir of dirs) {
      const dirPath = path.join(themesPath, dir.name);
      const readmePath = path.join(dirPath, "README.md");

      try {
        const readmeContent = await fs.readFile(readmePath, "utf8");
        const processed = await markdownProcessor.process(readmeContent);
        const parsed = grayMatter(String(processed));
        const result = {
          slug: dir.name,
          meta: parsed.data,
          readme: parsed.content,
        };

        readmes.push(result);

      } catch (err) {
        console.log(`README.md not found or unparsable in ${dirPath}`);
      }
    }
  } catch (err) {
    console.error(err);
  }

  return readmes;
}

const updateThemesMeta = async () => {
  const themesPath = getThemesPath();
  
  const themesMeta = await getThemeMetadata(themesPath);

  console.log("updateThemesMeta found themes", 
    themesMeta.map((theme) => theme.slug),
  );

  interkit_server.call("theme.setDefaultThemes", {
    themesMeta
  })
  .catch((e) => {
    console.error(
      "updateThemesMeta error",
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

export { updateThemesMeta };
