import { Meteor } from 'meteor/meteor';
import { Projects } from '/imports/collections.js';
import { userIsInRoles } from '../../imports/userRoles.js';

Meteor.publish('projects', function() {
  let fields = {
    name: 1,
    slug: 1,
    isDefaultProject: 1,
    isTemplate: 1,
    history : userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    projectServer: {
      status: 1,
      cpu:1,
      actionRequested: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
      messages: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    },
    uiState: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
  }
  //console.log("projects sub")
  if (userIsInRoles(this.userId, ['admin', 'author', 'bundler'])) {
    let projects = Projects.find({}, { fields});
    //console.log(projects.fetch())
    return projects;
  } 
});

// list in admin interface
Meteor.publish('projects.list', function() {
  let fields = {
    name: 1,
    slug: 1,
    isDefaultProject: 1,
    isTemplate: 1,
    history : userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    projectServer: {
      status: 1,
      cpu: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    },
  }
  //console.log("projects sub")
  if (userIsInRoles(this.userId, ['admin', 'author', 'bundler'])) {
    let projects = Projects.find({}, { fields});
    //console.log(projects.fetch())
    return projects;
  }
});

Meteor.publish('project', function(projectId) {
  //console.log("project sub")
  let projects = Projects.find({_id: projectId});
  return projects;
});
