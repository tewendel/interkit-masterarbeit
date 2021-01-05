import { Projects } from '../imports/collections.js';

const git = require('isomorphic-git')
const fs = require('fs')
const fse = require('fs-extra');
const dotenv = require('dotenv')
dotenv.config({
  path: `${process.env.PWD}/.env`
})

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
      return files;
  },

  // add a file to a project
  'file.create': async ({ filename, projectId }) => {
      const filePath = getRepoPath(projectId) + "/" + filename;
      if (!fs.existsSync(filePath)) {
        await fs.promises.writeFile(filePath, "")      
      } else {
        console.log("File already exists.");
      }
  },

  'file.load': async ({filename, projectId}) => {
      const filePath = getRepoPath(projectId) + "/" + filename;
      const data = await fs.promises.readFile(filePath)
      return {filename, content: data.toString()};
  },

  'file.save': async ({file, projectId})  => {
    const filePath = getRepoPath(projectId) + "/" + file.filename;
    await fs.promises.writeFile(filePath, file.content)      
  },

  'bundler.getUrl': async () => {
    return process.env.BUNDLER_URL
  }
  
});
