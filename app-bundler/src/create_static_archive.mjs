import * as path from 'path';
import { promises as fs } from 'fs';
import {createWriteStream} from 'fs';
import fetch from "node-fetch";
import http from "http";
import https from "https";

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


const create_static_archive =  async (req, res) => {

  if (!req.params.projectId) {// TODO verify projectId string
    res.sendStatus(400);
    console.warn("invalid or missing projectId")
    return
  }
  
  const projectId = req.params.projectId
  console.log("archiveData: archiving project", projectId);
  
  const response = await fetch(INTERKIT_SERVER_URL + `/archive?projectId=${projectId}`, {method: "get"})
  const archiveJSON = await response.json()

  console.log("got archive data from server", archiveJSON.data)
  
  if (!archiveJSON.data.project) {
    res.sendStatus(500);
    console.warn("invalid project or project not found")
    return
  }

  let archivePath = REPOSITORIES_PATH + "/projects/" + projectId + "/static/archive/"
  console.log("archivePath", archivePath)

  // create archive directory
  try {
    // Check if the directory exists
    await fs.access(archivePath);
    console.log(`Directory already exists: ${archivePath}`);
  } catch (error) {
    // If the directory does not exist, create it
    if (error.code === 'ENOENT') {
        await fs.mkdir(archivePath, { recursive: true });
        console.log(`Directory created: ${archivePath}`);
    } else {
        // Re-throw unexpected errors
        throw error;
    }
  }

  // write database dump as json
  await fs.writeFile(archivePath + "db.json", JSON.stringify(archiveJSON.data));
  
  console.log("archiving media...")
  let mediaPath = archivePath + "media"

  // create media directory
  try {
    // Check if the directory exists
    await fs.access(mediaPath);
    console.log(`Directory already exists: ${mediaPath}`);
  } catch (error) {
    // If the directory does not exist, create it
    if (error.code === 'ENOENT') {
        await fs.mkdir(mediaPath, { recursive: true });
        console.log(`Directory created: ${mediaPath}`);
    } else {
        // Re-throw unexpected errors
        throw error;
    }
  }

  // copy media files 
  for (const mediafile of archiveJSON.data.files) { 
    
    const link = `${INTERKIT_SERVER_URL}/cdn/storage/mediafiles/${mediafile._id}/original/${mediafile._id}.${mediafile.ext}`
    console.log("downloading file", link, mediaPath)

    downloadFile(link, path.resolve(mediaPath, mediafile._id + mediafile.extensionWithDot))
    .then(() => console.log('File downloaded successfully!'))
    .catch((error) => console.error(`Error downloading file: ${error.message}`));
    
  }
  
  console.log("archive done")
  res.send({status: "success"});

}

export { create_static_archive }