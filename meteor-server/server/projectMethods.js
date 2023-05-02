import { Meteor } from 'meteor/meteor';
import { Projects } from '../imports/collections.js';
import { duplicateProject, makeProjectHistoryEntry } from '../imports/projectUtils.js'

Meteor.methods({

  // create repo  
  'project.create': async ({ name, template, gitRepository }) => {
    
    const doc = { 
      name, 
      slug: name,
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
  },

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
  
});
