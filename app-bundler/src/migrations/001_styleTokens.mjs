import { promises as fs } from "fs";
import path from "path";
import { getProjectPath } from "../filesystem.mjs";

export default async function(projectId) {
  const projectPath = getProjectPath(projectId);
  const tokensFile = path.join(projectPath, "src", "styleTokens.json");
  const tokensFileContent = "{}";
  // create the file if it doesn't exist
  try {
    const exists = await fs.exists(tokensFile);
    if (!exists) {
      // create dir if it doesn't exist
      await fs.mkdir(path.dirname(tokensFile), { recursive: true });
      await fs.writeFile(tokensFile, tokensFileContent);
      console.log(`Migration 001: Created ${tokensFile}`);
    }
  } catch (e) {
    console.error(`Migration 001: Error`, e);
  }
  return true;
}