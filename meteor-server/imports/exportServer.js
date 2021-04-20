const BSON = require('bson');
const archiver = require('archiver');
const slugify = require('slugify');
const dateFormat = require('dateformat');
const cryptoRandomString = require('crypto-random-string');

const { getAllOfProject } = require('./projectUtils.js')

const generateFilename = () => {
  return cryptoRandomString({ length: 40 });
}

const hostname = require('os').hostname()

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


export const setupExportServer = (app) => {
  app.get('/export', async (req, res) => {
    exportData(req, res)
  })
}
