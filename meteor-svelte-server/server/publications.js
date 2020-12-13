import { Components } from '../imports/collections.js';

Meteor.publish('components.public', function() {
  return Components.find({});
});