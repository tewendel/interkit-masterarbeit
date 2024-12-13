import * as path from 'path';
import { promises as fs } from 'fs';
import {createWriteStream, readdirSync} from 'fs';
import fetch from "node-fetch";
import http from "http";
import https from "https";
import { lib as boardNodeUtil } from 'interkit/project-boards-nodes.js'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH
const INTERKIT_SERVER_URL = process.env.INTERKIT_SERVER_URL

function downloadFile(url, savePath) {
    const protocol = url.startsWith('https:') ? https : http;
    return new Promise((resolve, reject) => {
        const file = createWriteStream(savePath);
        const request = protocol.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (status code: ${response.statusCode})`));
                return;
            }
            response.pipe(file);
        });

        file.on('finish', () => {
            file.close(resolve); // Resolve once the file is fully written
        });

        file.on('error', (err) => {
            fs.unlink(savePath, () => reject(err)); // Delete the file on error
        });

        request.on('error', (err) => {
            fs.unlink(savePath, () => reject(err)); // Handle network errors
        });

        request.end();
    });
}

async function createDir(path) {
  try {
    // Check if the directory exists
    await fs.access(path);
    console.log(`Directory already exists: ${path}`);
  } catch (error) {
    // If the directory does not exist, create it
    if (error.code === 'ENOENT') {
        await fs.mkdir(path, { recursive: true });
        console.log(`Directory created: ${path}`);
    } else {
        // Re-throw unexpected errors
        throw error;
    }
  }
}


const create_static_archive =  async (req, res) => {

  if (!req.params.projectId) {// TODO verify projectId string
    res.sendStatus(400);
    console.warn("invalid or missing projectId")
    return
  }
  
  const projectId = req.params.projectId
  console.log("archiveData: archiving project", projectId);
  
  const response = await fetch(INTERKIT_SERVER_URL + `/archive?projectId=${projectId}`, {method: "get"})
  let archiveJSON = await response.json()

  console.log("got archive data from server", archiveJSON.data)
  
  if (!archiveJSON.data.project) {
    res.sendStatus(500);
    console.warn("invalid project or project not found")
    return
  }

  // add handlersFiles to archive
  const handlersDir = REPOSITORIES_PATH + "/projects/" + projectId + "/server/handlers"
  archiveJSON.data.handlersFiles = readdirSync(handlersDir).filter(file => file.substring(file.length - 3) === ".js")
  console.log(archiveJSON.data.handlersFiles)

  // add boards to archive
  archiveJSON.data.boards = await boardNodeUtil.boards.list(handlersDir);
  console.log(archiveJSON.data.boards)

  // add boardData to archive
  archiveJSON.data.boardData = {}
  for(let boardId of archiveJSON.data.boards) {
    const handle = boardNodeUtil.boards.projectBoardPath(false, projectId, boardId)
    archiveJSON.data.boardData[boardId] = await boardNodeUtil.boards.read(handle, {projectId, boardId, relative: false})
  }

  console.log("added board data", archiveJSON.data)

  let archivePath = REPOSITORIES_PATH + "/projects/" + projectId + "/static/archive/"
  console.log("archivePath", archivePath)

  // create archive directory
  await createDir(archivePath)
  
  // write database dump as json
  await fs.writeFile(archivePath + "db.json", JSON.stringify(archiveJSON.data));
  
  console.log("archiving media...")
  let mediaPath = archivePath + "media"

  // create media directory
  await createDir(mediaPath)
  
  // copy media files 
  for (const mediafile of archiveJSON.data.files) { 
    const link = `${INTERKIT_SERVER_URL}/cdn/storage/mediafiles/${mediafile._id}/original/${mediafile._id}.${mediafile.ext}`
    console.log("downloading file", link, mediaPath)

    downloadFile(link, path.resolve(mediaPath, mediafile._id + mediafile.extensionWithDot))
    .then(() => console.log('File downloaded successfully!'))
    .catch((error) => console.error(`Error downloading file: ${error.message}`));  
  }

  // copy handlers
  let handlersPath = archivePath + "handlers"
  await createDir(handlersPath)

  for (const handlerFile of archiveJSON.data.handlersFiles) {   
    await fs.copyFile(handlersDir + "/" + handlerFile, handlersPath + "/" + handlerFile)
  }
  
  console.log("archive done")
  res.send({status: "success"});

}

export { create_static_archive }