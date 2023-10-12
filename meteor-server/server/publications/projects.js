import { Meteor } from 'meteor/meteor';
import { Projects } from '/imports/collections.js';
import { userIsInRoles } from '../../imports/userRoles.js';

Meteor.publish('projects', function() {
  let fields = {
    name: 1,
    slug: 1,
    isDefaultProject: 1,
    isTemplate: 1,
    history: userIsInRoles(this.userId, ["admin", "author", "bundler"]),
    projectServer: {
      status: 1,
      cpu: 1,
      actionRequested: userIsInRoles(this.userId, [
        "admin",
        "author",
        "bundler",
      ]),
      messages: userIsInRoles(this.userId, ["admin", "author", "bundler"]),
    },
    uiState: userIsInRoles(this.userId, ["admin", "author", "bundler"]),
    devServer: userIsInRoles(this.userId, ["admin", "author", "bundler"]),
  };
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
    devServer: userIsInRoles(this.userId, ['admin', 'author', 'bundler']),
    uiState: userIsInRoles(this.userId, ['admin', 'author', 'bundler'])
  }
  //console.log("projects sub")
  if (userIsInRoles(this.userId, ['admin', 'author', 'bundler'])) {
    let projects = Projects.find({}, { fields});
    //console.log(projects.fetch())
    return projects;
  }
});

class ProjectSubscriptionTracker {
  constructor() {
    this.pubCount = {};
  }

  inc(projectId) {
    this.pubCount[projectId] = this.pubCount[projectId] + 1 || 1;
    this.update(projectId);
  }

  dec(projectId) {
    this.pubCount[projectId]--;
    this.update(projectId);
  }

  startDevServer(projectId) {
    Projects.update(
      { _id: projectId },
      { $set: { ["devServer.actionRequested"]: "start" } }
    );
  }

  stopDevServer(projectId) {
    Projects.update(
      { _id: projectId },
      { $set: { ["devServer.actionRequested"]: "stop" } }
    );
  }

  update(projectId) {
    if (this.pubCount[projectId] > 0) {
      this.startDevServer(projectId);
    } else {
      Meteor.setTimeout(() => {
        // delayed stop
        if (this.pubCount[projectId] === 0) {
          this.stopDevServer(projectId);
        }
      }, 30 * 1000);
    }
  }

}

const projectSubscriptionTracker = new ProjectSubscriptionTracker();

// this publication is supposed to be used by the authoring interface
Meteor.publish('project', function(projectId) {
  let projects = Projects.find({_id: projectId});

  this.onStop(() => {
    if (userIsInRoles(this.userId, ["admin", "author"])) {
      projectSubscriptionTracker.dec(projectId);
    }
  });

  if (userIsInRoles(this.userId, ["admin", "author"])) {
    projectSubscriptionTracker.inc(projectId);
  }

  return projects;
});
