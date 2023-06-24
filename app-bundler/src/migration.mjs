import m001 from "./migrations/001_styleTokens.mjs";

const migrated = []

async function migrateProject(projectId) {
  await m001(projectId);
}

async function runMigrationsOncePerProject(projects) {
  for (const project of projects) {
    if (migrated.includes(project.id)) {
      continue;
    }
    migrated.push(project.id);
    await migrateProject(project.id);
  }
}

export {
  runMigrationsOncePerProject
}