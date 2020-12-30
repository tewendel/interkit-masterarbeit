import { Projects } from '../imports/collections.js';

const git = require('isomorphic-git')
const fs = require('fs')
const fse = require('fs-extra');

const getRepoPath = (projectId) => {
   return process.env.REPOSITORIES_PATH + "/projects/" + projectId
}


Meteor.methods({

  // create repo  
  'project.create': async ({ name }) => {

      let projectId = await Projects.insert({ name });

      if(projectId) {  
        const starterPath = process.env.REPOSITORIES_PATH + "/starter"
        const repoPath = getRepoPath(projectId)
        
        // create new directory and initialize repo
        try {
          if (!fs.existsSync(repoPath)) {
            await fs.promises.mkdir(repoPath);
            console.log("Directory is created.");
            await git.init({fs, dir: repoPath});
            await fse.copySync(starterPath, repoPath)

          } else {
            console.log("Directory already exists.");
          }
        } catch (err) {
            console.log(err);
        }
      }
  },

  'project.remove': async ({ projectId }) => {
      Projects.remove(projectId);
  },

  'project.list': async ({ projectId }) => {
      const files = await fs.promises.readdir(getRepoPath(projectId))
      console.log(files);
      return files;
  },

  // add a file to a project
  'file.create': async ({ projectId, filename}) => {

      const repoPath = process.env.REPOSITORIES_PATH + "/projects/" + projectId
      const filePath = repoPath + "/" + filename;

      await fs.promises.writeFile(filename, "")
      await git.add({ fs, dir: repoPath, filename })
  }
});
