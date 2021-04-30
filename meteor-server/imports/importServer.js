const BSON = require('bson');
const StreamZip = require('node-stream-zip');
const dateFormat = require('dateformat');
const multer = require('multer');
const upload = multer({ dest: '/tmp' }) // Temp dir for multer
import { Random } from 'meteor/random'
import { importProjectMediaFile, removeProjectMedia } from './mediaServer'
import { importProjectData, replaceProjectData } from './projectUtils'

import cors from 'cors'

const headers = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*")
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
}

const importData = async (req, res) => {

  /*res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");*/


  //if (!request.query.uploadToken || !uploadTokens.has(request.query.uploadToken)) {
  //  throw Boom.unauthorized("wrong or missing downloadToken.");
  //}; uploadTokens.delete(request.query.uploadToken)
  //
  //console.log(EJSON.parse(request.payload.data))

  //console.log(request.payload)

  //return new Promise( resolve => {

  const errorMessages = []

  if (!req.file) {
    res.sendStatus(400)
    return
  }

  let replace = false
  let newProjectId = null

  if (req.body.projectId) {
    replace = true
    newProjectId = req.body.projectId // TODO validate projectId
  } else {
    newProjectId = Random.id()
  }

  console.log(req.file)

  const zip = new StreamZip({
    file: req.file.path,
    storeEntries: true
  });

  // Handle errors
  zip.on('error', err => { console.log(err) });

  zip.on('ready', async () => {
    // list entries
    console.log('Entries read: ' + zip.entriesCount);
    for (const entry of Object.values(zip.entries())) {
      const desc = entry.isDirectory ? 'directory' : `${entry.size} bytes`;
      console.log(`Entry ${entry.name}: ${desc}`);
    }

    // unzip meta
    const json = zip.entryDataSync('meta.json');
    const meta = JSON.parse(json)

    // unzip data
    const bson = zip.entryDataSync('project.bson')//.toString();
    const data = BSON.deserialize(bson)
    
    //console.log(meta, data)

    console.log(`${replace ? "Replacing" : "Importing"} project "${meta.projectName}" to ${newProjectId}`)

    // clean up
    if (replace) removeProjectMedia(newProjectId)

    // upload files with new filename

    const newFiles = []
    if (data.files) {

      for (file of data.files) {

        console.log(`importing ${file.name}`)

        try {
          const fileBuffer = zip.entryDataSync('files/' + file.name);
          const fileName = file.name
          const fileType = file.type
          const fileMeta = file.meta
          const projectId = newProjectId
          const newFile = await importProjectMediaFile(fileBuffer, fileName, fileType, projectId, fileMeta)
          newFiles.push(newFile)
          //console.log(newFile)

        } catch (error) {
          console.log("unzip error", error)
          errorMessages.push("unzip error " + file.name)
        }

      }
    }
    

    //const project = data.project

    const newProjectName = meta.filename ?
      `${meta.projectName} (imported from ${meta.filename} at ${dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss")})`
      : `${meta.projectName} (imported ${dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss")})`

    // overwrite files with imported files
    data.files = newFiles

    if (replace) {
      replaceProjectData(data, newProjectId, meta)
    } else {
      importProjectData(data, newProjectName, newProjectId, meta)
    }

    //console.log(project)

    // Do not forget to close the file once you're done
    zip.close()

    res.status(200).send(errorMessages.length > 0 ? JSON.parse(errorMessages) : {status: "ok"})
    res.end();
  });

  //})

  return true


  //const payload = {
  //  ...request.payload,
  //  datas: EJSON.fromJSONValue(request.payload.data)
  //}
  //console.log(payload)
  //insertProjectAsDuplicate(request.payload.data)

}

export const setupImportServer = (app) => {
  app.post('/import', upload.single('importfile'), cors(), headers, async (req, res) => { // should be PUT, but PUT creates cors issues
    importData(req, res)
  })
}
