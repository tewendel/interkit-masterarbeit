import { Git } from "node-git-server";
import * as path from "path";

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH;

const projectsPath = path.join(REPOSITORIES_PATH, "projects");

const repos = new Git(projectsPath, {
  autoCreate: false,
});

repos.on("fetch", (fetch) => {
  console.log(`git fetch ${fetch.commit}`);
  fetch.accept();
});

const git_server_middleware = function (req, res) {
  repos.handle(req, res);
};

export { git_server_middleware };
