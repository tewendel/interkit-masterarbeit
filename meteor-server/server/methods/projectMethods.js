import { Meteor } from 'meteor/meteor';
import { Projects } from '../../imports/collections.js';
import { duplicateProject, makeProjectHistoryEntry } from '../../imports/projectUtils.js'
import { promises as fs } from 'fs';
import { importData } from '../../imports/importServer.js';

const createProject = async ({ name, template, gitRepository, isTemplate }) => {
    
  const doc = { 
    name, 
    slug: name,
    isTemplate,
    history: [
      makeProjectHistoryEntry("create_project", {
        template,
        gitRepository
      })
    ]
  }

  let projectId = await Projects.insert(doc);

  return projectId

  // bundler will be notified via subscription
}

Meteor.methods({

  // create repo  
  'project.create': createProject, 

  'project.remove': async ({ projectId }) => {
      Projects.remove(projectId);
  },


  'project.rename': async ({ projectId, newName }) => {
    console.log("proejct.rename", projectId, newName)
    let project = Projects.find(projectId);
    if(project) {
      Projects.update({_id: projectId}, {$set: { name: newName }})
    }
  },

  'project.duplicate': async ({ projectId, newProjectName }) => {
      return duplicateProject(projectId, newProjectName)
  },

  'project.setSlug': async ({ projectId, slug }) => {
    console.log("setSlug", projectId, slug, Projects.findOne({ slug }), Meteor.userId() )
    if (!Projects.findOne({ slug }) ) {
      const res = Projects.update({_id: projectId}, { $set: { slug } })
      console.log("setSlug result", res)
      return slug
    } else {
      return false
    }
    
  },

  'project.setIsTemplate': async ({ projectId, isTemplate }) => {
    console.log('project.setIsTemplate', projectId, isTemplate)
    const res = Projects.update({ _id: projectId }, { $set: { isTemplate } })
    return res
  },

  'project.getId': async ({ slug }) => {
    let project = Projects.findOne({ slug });
    console.log("getId for slug", slug, project?._id);
    if(project) {
      return project._id
    } else {
      return null
    }
  },

  'project.projectServer.init': async ({ projectId }) => {
    //console.log("project.projectServer.init", projectId)
    const res = Projects.update({_id: projectId}, { $set: { projectServer: {
      status: "init",
      messages: [
        {
          type: "system",
          text: "Initializing project server...",
          date: new Date()
        }
      ]
    } } })
    //console.log("project.projectServer.init result", res)
    return res
  },

  'project.projectServer.addMessage': async ({ projectId, message }) => {
    if (!message.date) {
      message.date = new Date()
    }
    //console.log("project.projectServer.addMessage", projectId, message)
    const res = Projects.update({_id: projectId}, { 
      $push: {
          'projectServer.messages': {
            $each: [ message ],
            $sort: { date: -1 },
            $slice: 500 // limit the number of messages
          }
        }
      })
    
    //console.log("project.projectServer.addMessage result", res)
    return res
  },

  'project.projectServer.clearMessages': async ({ projectId }) => {
    //console.log("project.projectServer.clearMessags", projectId)
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.messages': [] } })
    //console.log("project.projectServer.clearMessags result", res)
    return res
  },

  'project.projectServer.setStatus': async ({ projectId, status }) => {
    //console.log("project.projectServer.setStatus", projectId, status)
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.status': status } })
    //console.log("project.projectServer.setStatus result", res)
    return res
  },

  'project.projectServer.setCpu': async ({ projectId, cpu }) => {
    //console.log("project.projectServer.setCpu", projectId, cpu)
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.cpu': cpu } })
    //console.log("project.projectServer.setCpu result", res)
    return res
  },

  'project.projectServer.start': async ({ projectId }) => {
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.actionRequested': "start" } })
  },

  'project.projectServer.stop': async ({ projectId }) => {
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.actionRequested': "stop" } })
  },

  'project.projectServer.resetRequestedAction': async ({ projectId }) => {
    const res = Projects.update({_id: projectId}, { $set: { 'projectServer.actionRequested': null } })
  },

  'project.viteServer.setStatus': async ({ projectId, status, message }) => {
    //console.log("project.viteServer.setStatus", projectId, status, message)
    const res = Projects.update({_id: projectId}, { $set: { 'uiState.viteServer.status': status, 'uiState.viteServer.message': message } })
  },

  'project.makeDefaultProject': async ({ projectId }) => {
    console.log("makeDefaultProject", projectId, Meteor.userId())
    if (Projects.findOne(projectId)) {
      const resUnset = Projects.update({ _id: { $ne: projectId }}, { $set: { isDefaultProject: false } }, { multi: true})
      const resSet = Projects.update({ _id: projectId }, { $set: { isDefaultProject: true } })
      console.log("isDefaultProject result", resSet, resUnset)
      return true
    } else {
      return false
    }
  },

  // update a section in project uiState
  // -> project.uiState[section] = data
  'project.updateUiState': async ({ projectId, section, data }) => {
    const res = Projects.update({
        _id: projectId,
    }, {
        $set: {
          [`uiState.${section}`]: data
        }
    });
  },

  'bundler.getUrl': async () => {
    return process.env.BUNDLER_URL
  },

  // method to create new projects based on the templates defined in starters
  // template folders must begin with "template-"
  'project.rebuildTemplates': async () => {    
    console.log("rebuilding project templates")
    const REPOSITORIES_PATH = process.env.REPOSITORIES_PATH
    const templateFolder = REPOSITORIES_PATH + "/starters"
    const files = await fs.readdir(templateFolder)
    for(let file of files) {
      if(file.substring(0, 9) == "template-") {
        const templateName = file.substring(9)
        console.log("template", templateName)
        // Build template project if it doesn't exist yet
        // TODO ask if user wants to replace it, for now templates need to be deleted manually to rebuild
        let existingProject = Projects.findOne({name: templateName})
        if(existingProject) {
          console.log(`Project called ${templateName} already exists, skipping build`)
        } else {
          // create the project entry in the database 
          // bundler will copy respository when notified through subscription in filesystem/ensureRepositories
          let projectId = await createProject({
            name: templateName,
            template: file,
            isTemplate: true,
          })
          // import seed data and mediafiles, if available
          const seedDataPath = templateFolder + "/" + file + "/seed.zip";
          await importData({body: {projectId}, file: {path: seedDataPath}})
        }
      }
    }
  },

  // method to remove all template projects
  'project.removeTemplates': async () => {
    console.log("removing project templates")
    Projects.find({isTemplate: true}).forEach(async project => {
      console.log("removing", project.name)
      await Meteor.call('project.remove', {projectId: project._id})
    })
  },
  
});
