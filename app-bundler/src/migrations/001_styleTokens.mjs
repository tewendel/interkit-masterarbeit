import { promises as fs } from "fs";
import path from "path";
import { getProjectPath } from "../filesystem.mjs";

export default async function(projectId) {
  const projectPath = getProjectPath(projectId);
  const tokensFile = path.join(projectPath, "src", "styleTokens.json");
  const tokensFileContent = "{}";
  // create the file if it doesn't exist
  try {
    await fs.exists(tokensFile);
  } catch (e) {
    // create dir if it doesn't exist
    await fs.mkdir(path.dirname(tokensFile), { recursive: true });
    await fs.writeFile(tokensFile, tokensFileContent);
    console.log(`Migration 001: Created ${tokensFile}`);
  }
  return true;
}