import * as path from 'path';
import archiver from 'archiver';

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

import { promisify } from 'util';

const get_bundle_zip =  async (req, res) => {

  const projectId = req.params.projectId;
  const projectPath = path.join(REPOSITORIES_PATH, "projects", projectId)
  console.log(projectPath);

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="bundle.zip"');

  const zipfile = archiver('zip');

  zipfile.on('error', (err) => {
    console.log(err)
    throw err;
  });

  zipfile.pipe(res);
  zipfile.directory(projectPath + "/public", '/').finalize();
}

export { get_bundle_zip }