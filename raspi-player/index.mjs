import { setup as serverSetup } from "interkit/interkit-connect.js";
import { downloadFile } from "./src/downloadFile.mjs";
import playSound from "play-sound";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename } from "node:path";
import { resolve } from "path";

const projectFolder = resolve("./tmp");

const player = playSound();

const [endpoint, projectId, username, password] = process.argv.slice(2);

if (!endpoint || !projectId || !username || !password) {
  console.log(`Usage:
  
npm start <endpoint> <projectId> <username> <password>

example: 
$ npm start ws://localhost:3000/websocket TB38WTNBewMYe6YYe raspi1 raspi1

Recommendation: 
Use pm2 process manager to recover from crashes. Example:
$ pm2 start --restart-delay=60000 "npm start <endpoint> <projectId> <username> <password>"
`);
  process.exit(1);
}

console.log(`starting raspi player
- endpoint: ${endpoint}
- projectId: ${projectId}
- username: ${username}
- password: ${password}
`);

let server = null;

let processedMessageIds = [];

const setup = async () => {
  server = await serverSetup(
    {
      endpoint,
    },
    {
      username,
      password,
    }
  );

  let pub = "messages.latest.forMe";
  let col = "messages";

  let projectsSub = server.subscribe(pub, { projectId });

  await projectsSub.ready();

  console.log("subsription ready");

  let reactiveCollection = server.collection(col).reactive();

  reactiveCollection.onChange(async (newData) => {
    const message = newData?.[0];
    const payload = newData?.[0]?.payload;

    if (!message) return;
    //console.log(message)

    if (processedMessageIds.includes(message.id)) return;
    else processedMessageIds.push(message.id);

    //console.log(processedMessageIds)

    if (payload?.type == "audio" && payload?.mediafileKey) {
      const mediafile = await server.call("mediafile.get", {
        projectId,
        key: payload.mediafileKey,
      });

      //console.log(mediafile);

      const url = mediafile?.link;

      if (url) {
        try {

          mkdir(projectFolder, { recursive: true });

          const targetFile =
            projectFolder +
            "/" +
            payload.mediafileKey +
            mediafile.extensionWithDot;

          if (existsSync(targetFile)) {
            console.log(`found ${basename(targetFile)} in local cache`);
          } else {
            console.log(`downloading ${basename(targetFile)}`);
            await downloadFile(url, targetFile);
          }

          console.log("playing", basename(targetFile));

          player.play(targetFile, function (err) {
            //if (err) throw err;
            console.warn(err);
          });
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  });
};

setup()
