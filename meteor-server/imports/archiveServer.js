
const { getAllOfProject } = require('./projectUtils.js')
import { promises as fs } from 'fs';

const archiveData = async (req, res) => {

  if (!req.query.projectId) {// TODO verify projectId string
    res.sendStatus(400);
    console.warn("invalid or missing projectId")
    return
  }
  
  const projectId = req.query.projectId
  console.log("archiveData: archiving project", projectId);

  const data = await getAllOfProject(projectId)

  if (!data.project) {
    res.sendStatus(500);
    console.warn("invalid project or project not found")
    return
  }

  console.log("archiving data", data)

  const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH
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
  await fs.writeFile(archivePath + "db.json", JSON.stringify(data));
  
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
  for (const file of data.files) { 
    console.log("copying file", file.path, file.name)
    await fs.copyFile(file.path, mediaPath + "/" + file._id + file.extensionWithDot)
    // todo: in case this doesn't work on server with volumes use mediafile link instead of path 
    // mediafile.link =
    //  `${get(config).INTERKIT_SERVER_URL}/cdn/storage/mediafiles/${mediafile._id}/original/${mediafile._id}.${mediafile.ext}`
  }

  console.log("archive done")
  res.send({status: "success"});
}

export const setupArchiveServer = (app) => {
  app.get('/archive', async (req, res) => {
    archiveData(req, res)
  })
}
