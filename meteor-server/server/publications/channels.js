import { Meteor } from 'meteor/meteor';
import { Channels } from '../../imports/collections.js';

Meteor.publish("channels", ({projectId}) => {
  let query = {projectId};
  console.log("channels sub with query", query);
  let channels = Channels.find(query, {sort: {createdAt: -1}});
  //console.log(channels.fetch());
  return channels;
});