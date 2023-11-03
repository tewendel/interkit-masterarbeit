import path from "path";
import { promises as fs } from "fs";
import { getProjectPath, getThemesPath } from "./filesystem.mjs";
import { copy } from "fs-extra";

const themeDir = ["static", "theme"];

// request path: /themes/:themeSlug/applyToProject=:projectId
const get_themes_remove = async (req, res) => {
    //console.log("get_themes_apply", req);

    const projectId = req.query.removeFromProject;

    console.log("remove theme from project", projectId);

    const projectPath = getProjectPath(projectId);

    const projectThemePath = path.join(
      projectPath,
      ...themeDir
    );

    // delete theme files from project
    try {
      await fs.rm(projectThemePath, { recursive: true });
    } catch (err) {
      console.error("Error while removing theme from project", err);
    }

    res.json({ result: "ok" });
  };

export { get_themes_remove };