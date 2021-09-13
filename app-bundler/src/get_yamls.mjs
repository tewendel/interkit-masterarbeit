import * as path from 'path';
import { promises as fs } from 'fs';
import { parse } from 'yaml'
import { resolveProjectPath } from './utils.mjs'

const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH

const get_yamls =  async (req, res) => {

  const projectSlug = req.params.projectSlug;
  const projectId = resolveProjectPath(projectSlug, res);
  
  if(projectId) {
    //console.log("get_yamls")
    const projectNodeModulesComponentsPath = path.join(REPOSITORIES_PATH, "projects", projectId, "node_modules", "interkit", "components")
    // TODO include customized components from project
    console.log(projectNodeModulesComponentsPath);

    // make a list of files and paths

    const yamlFiles = []
    try {
      const files = await fs.readdir(projectNodeModulesComponentsPath);
      for (const file of files)
        if (file.substr(-5) === ".yaml" || file.substr(-4) === ".yml") {
          yamlFiles.push({
            name: file,
            path: projectNodeModulesComponentsPath + "/" + file,
          })
        }
    } catch (err) {
      console.error(err);
    }

    console.log("getting yaml files: ", JSON.stringify(yamlFiles))

    // read files and construct result object

    let resultObj = {
      errors: [],
      components: []
    }

    for (let file of yamlFiles) {

      let yaml = null

      // read file

      try {
        const fileBuffer = await fs.readFile(file.path);
        yaml = fileBuffer.toString()
        //console.log(yaml)
      } catch (err) {
        console.error(err);
        resultObj.errors.push({
          file: file.name,
          name: "file read error",
          errorMessage: `file read error at ${file.name}: ` + JSON.stringify(err)
        })
      }

      // parse json

      if (yaml) {
        try {
          const json = parse(yaml)
          resultObj.components.push({
            file: file.name,
            json,
            yaml
          })
          //console.log(obj)
        } catch (err) {
          console.error("yaml parser error:", file.path, err);
          res.contentType("application/json");
          resultObj.errors.push({
            file: file.name,
            error: "yaml parser error",
            errorMessage: `yaml parser error at ${file.name}: ` + err
          })
        }
      }

    } 

    // send results
    
    if (resultObj.errors.length > 0)
    {
      res.status(404)
    }
    res.contentType("application/json");
    res.send(resultObj)
  }
}

export { get_yamls }