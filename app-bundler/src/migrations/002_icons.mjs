import { promises as fs } from "fs";
import path from "path";
import { getProjectPath } from "../filesystem.mjs";

export default async function(projectId) {
  const projectPath = getProjectPath(projectId);

  return true;
}