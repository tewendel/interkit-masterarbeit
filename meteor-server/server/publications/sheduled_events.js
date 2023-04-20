import { Meteor } from 'meteor/meteor';
import { ScheduledEvents } from '../../imports/collections.js';

// provides unexecuted events sorted by execTime
Meteor.publish("scheduled_events", ({projectId, anyStatus}) => {
  let query = {
    projectId
  }
  if (!anyStatus) {
    query.status = 'scheduled'
  }
  let events = ScheduledEvents.find(query, {sort: {execTime: -1}});
  return events;
});