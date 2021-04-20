const BSON = require('bson');
const fs = require('fs');
const archiver = require('archiver');
const StreamZip = require('node-stream-zip');
const slugify = require('slugify');
const dateFormat = require('dateformat');
const crypto = require('crypto')
const cryptoRandomString = require('crypto-random-string');

const { getAllOfProject, insertProjectAsDuplicate, updateProjectData } = require('./projectUtils.js')

const generateFilename = () => {
  return cryptoRandomString({ length: 40 });
}

const hostname = require('os').hostname()
const uploadTokens = new Set();

const makeFilename = (prefix = "export", hostname = "unknownorigin", extension = ".zip") => {
  const date = dateFormat(new Date(), "yyyy-mm-dd-HH-MM")
  const filename = [prefix, hostname, date].join("_") + extension
  return filename
}


const exportData = async (req, res) => {

  if (!req.query.projectId) {// TODO verify projectId string
    res.sendStatus(400);
    console.warn("invalid or missing projectId")
    return
  }
  
  const projectId = req.query.projectId
  console.log("exportData: exporting project", projectId);

  const data = await getAllOfProject(projectId)

  console.log(data)

  if (!data.project) {
    res.sendStatus(500);
    console.warn("invalid project or project not found")
    return
  }

  //const secret = require('crypto').createHash('sha1').update(Math.random().toString()).digest('hex');

  const filename = makeFilename(`interkit-project-${slugify(data.project.name)}`, slugify(hostname))

  const meta = {
    projectName: data.project.name,
    timestamp: Date.now(),
    request: req.query,
    hostname,
    success: true,
    filename,
  }

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // create zip archive
  var archive = archiver('zip', {
    zlib: { level: 1 } // Sets the compression level.
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function (err) {
    console.log(err)
  });

  // good practice to catch this error explicitly
  archive.on('error', function (err) {
    console.log(err)
    throw err;
  });

  // pipe archive data to response
  archive.pipe(res);

  // add json data to zip archive
  archive.append(JSON.stringify(meta), { name: 'meta.json' });
  archive.append(BSON.serialize(data), { name: 'project.bson' });

  // add files to zip archive
  for (const file of data.files) { // TODO do not use absolute path
    archive.file( file.path, { name: `files/${file.name}` });
  }

  archive.finalize();

  //console.log(out)
  console.log("export done")
}

const importData = async (request, mongoose, logger) => {

  //if (!request.query.uploadToken || !uploadTokens.has(request.query.uploadToken)) {
  //  throw Boom.unauthorized("wrong or missing downloadToken.");
  //}; uploadTokens.delete(request.query.uploadToken)
  //
  //console.log(EJSON.parse(request.payload.data))

  //console.log(request.payload)

  //return new Promise( resolve => {

  const errorMessages = []

  const zip = new StreamZip({
    file: request.payload.path,
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

    // unzip
    const bson = zip.entryDataSync('project.bson')//.toString();
    const obj = BSON.deserialize(bson)
    let data = obj.data

    console.log(`importing project "${obj.projectName}"`)

    // upload files with new filename

    if (data.files) {
      // generate new filenames
      filenameMappings = data.files.map(file => ({
        old: file.filename,
        new: generateFilename()
      }))

      const s3 = new aws.S3();

      for (file of data.files) {

        console.log(`uploading ${file.filename}`)

        try {
          const fileBuffer = zip.entryDataSync('files/' + file.path);
          const newFilename = filenameMappings.find(n => n.old === file.path).new

          var params = {
            Body: fileBuffer,
            Bucket: S3_BUCKET,
            Key: newFilename,
            ContentType: file.mimetype
          };
          try {
            const result = await s3.putObject(params).promise();
            console.log("upload success", result)

            console.log(`uploaded file ${file.filename} as ${newFilename}`)

            file.filename = newFilename
            file.path = newFilename

          } catch (error) {
            console.log("upload error", error)
            errorMessages.push("upload error " + file.name)
          }

        } catch (error) {
          console.log("unzip error", error)
          errorMessages.push("unzip error " + file.name)
        }

      }
    }

    //const project = data.project

    const newProjectName = obj.filename ?
      `${obj.projectName} (imported from ${obj.filename} at ${dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss")})`
      : `${obj.projectName} (imported ${dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss")})`

    insertProjectAsDuplicate(data, newProjectName)

    //console.log(project)

    // Do not forget to close the file once you're done
    zip.close()

    resolve({ errorMessages })
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


const updateProject = async (request, mongoose, logger) => {

  //console.log(request.payload)

  return new Promise(resolve => {

    const errorMessages = []

    const zip = new StreamZip({
      file: request.payload.path,
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

      // unzip
      const bson = zip.entryDataSync('project.bson')//.toString();
      const obj = BSON.deserialize(bson)
      let data = obj.data

      const updateStatus = await updateProjectData(data, request.query.doUpdates == "true")

      // Do not forget to close the file once you're done
      zip.close()

      resolve({ updateStatus, errorMessages })
    });

  })
}

export const setupExportServer = (app) => {
  app.get('/export', async (req, res) => {
    exportData(req, res)
  })
}
/*
module.exports = function (server, mongoose, logger) {

  server.route({
    method: 'GET',
    path: '/uploadToken',
    config: {
      handler: request => uploadToken(request, mongoose, logger),
      auth: Auth.strategy,
      tags: ['api'],
      plugins: {
        'hapi-swagger': {}
      }
    }
  })



  server.route({
    method: 'PUT',
    path: '/export',
    config: {
      handler: request => importData(request, mongoose, logger),
      auth: false,
      tags: ['api'],
      payload: {
        output: 'file',
        parse: false,
        allow: 'application/zip',
        maxBytes: 1000000000, // 1G
      },
      plugins: {
        'hapi-swagger': {}
      }
    }
  })

  server.route({
    method: 'PUT',
    path: '/updateProject',
    config: {
      handler: updateProject,
      auth: false,
      tags: ['api'],
      payload: {
        output: 'file',
        parse: false,
        allow: 'application/zip',
        maxBytes: 1000000000, // 1G
      },
      plugins: {
        'hapi-swagger': {}
      }
    }
  })

}
*/