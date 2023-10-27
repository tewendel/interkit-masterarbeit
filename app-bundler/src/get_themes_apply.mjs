import path from "path";
import { promises as fs } from "fs";
import { getProjectPath, getThemesPath } from "./filesystem.mjs";
import { copy } from "fs-extra";

const themeDir = ["static", "theme"];

// request path: /themes/:themeSlug/applyToProject=:projectId
const get_themes_apply = async (req, res) => {
    //console.log("get_themes_apply", req);

    const themeSlug = req.params.themeSlug;
    const projectId = req.query.applyToProject;

    console.log("apply theme", themeSlug, "to project", projectId);

    const projectPath = getProjectPath(projectId);
    const themePath = path.join(getThemesPath(), themeSlug);

    const projectThemePath = path.join(
      projectPath,
      ...themeDir
    );

    // copy theme files to project
    try {
      await copy(themePath, projectThemePath, { overwrite: true });
    } catch (err) {
      console.error("Error while copying theme to project", err);
    }

    res.json({ result: "ok" });
  };

export { get_themes_apply }