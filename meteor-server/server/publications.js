import { Projects } from '../imports/collections.js';

Meteor.publish('projects.public', function() {
  return Projects.find({});
});