import { Git } from "node-git-server";
import * as path from "path";
import {
  gitSetupAllowPush,
  gitCheckout,
  getResetIndex,
  gitClean,
} from "./git.mjs";
import { getProjectPath } from "./filesystem.mjs";

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const projectsPath = path.join(REPOSITORIES_PATH, "projects");

const repos = new Git(projectsPath, {
  autoCreate: false,
  authenticate: ({ type, user, repo }, next) =>
    type == "push"
      ? user((username, password) => {
          console.log("push", {username, repo});
          if (password == ADMIN_PASSWORD) {
            next();
          }
          else {
            next("Invalid password. Password should be ADMIN_PASSWORD. username does not matter");
          }
        })
      : next(),
});

repos.on("fetch", (fetch) => {
  console.log(`git fetch ${fetch.commit}`);
  fetch.accept();
});

repos.on("push", async (push) => {
  console.log(`push ${push.repo}/${push.commit} ( ${push.branch} )`);
  await gitSetupAllowPush(getProjectPath(push.repo));
  await push.accept();
  console.log("push accepted");
  setTimeout(async () => {
    await gitCheckout(getProjectPath(push.repo));
    await getResetIndex(getProjectPath(push.repo));
    await gitClean(getProjectPath(push.repo));
    console.log("done: git reset --hard");
  },2000) // find out how to wait for git push to finish
});

const git_server_middleware = function (req, res) {
  repos.handle(req, res);
};

export { git_server_middleware };
