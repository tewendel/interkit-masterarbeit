import { Meteor } from 'meteor/meteor';
import { Messages, Channels, ScheduledEvents } from '../imports/collections.js';
import { add } from 'date-fns'
import * as pushnotifications from '../imports/pushnotifications.js'

Meteor.methods({

  'channel.create': ({projectId, channel_key}) => {
    console.log("channel.create", projectId, channel_key)
    let channels = Channels.find({projectId, channel_key}).fetch()
    if(channels.length) {
      console.log("channel already exists, aborting")
      return;
    }
    Channels.insert({projectId, channel_key, active: true})
  },

  'channel.delete': ({projectId, channel_key}) => {
    console.log("channel.delete")
    let channels = Channels.find({projectId, channel_key}).fetch()
    if(channels.length) {
      Channels.remove({_id: channels[0]._id})
    } else {
      console.log("channel.delete - channel not found", projectId, channel_key)
    }
  },

  'channel.setProperty': ({projectId, channel_key, property, value}) => {
    let channels = Channels.find({projectId, channel_key}).fetch()
    if(channels.length) {
      Channels.update({_id: channels[0]._id}, {$set: {[property]: value}})
    } else {
      console.log("channel.setProperty - channel not found", projectId, channel_key)
    }
  },

  'channel.seeAll': ({projectId, channel_key, userId}) => {
    console.log("channel.seeAll", channel_key, userId)
    Messages.update(
      {projectId, channel_key: channel_key, seen: {"$nin": [userId]}}, 
      {$push: {seen: userId}},
      {multi: true}
    );
  },
 
  'message.setHandled': ({messageId, handledBy = []}) => {
    console.log("message.setHandled", messageId, handledBy)
    Messages.update({_id: messageId}, {$set: {handledAt: new Date(), handledBy}})
  },

  'message.submitChoice': ({projectId, channel_key, sender, messageId, selectedKey}) => {
    console.log("### selecting ", messageId, selectedKey)
    Messages.update({_id: messageId}, {$set: {selectedChoiceKey: selectedKey}})

    Messages.insert({
      projectId,
      sender,
      recipients: [],
      channel_key,
      payload: {type: "select", key: selectedKey},
      origin: undefined,
      createdAt: new Date()
    })
  },

  'message.submitLocation': ({projectId, channel_key, sender, messageId, location, canceled}) => {
    console.log("message.submitLocation", location)
    Messages.update({_id: messageId}, {$set: {submitted: true, canceled}})

    Messages.insert({
      projectId,
      sender,
      recipients: [],
      channel_key,
      payload: canceled ? {type: "locationRequestCanceled"} : {type: "locationResponse", location},
      origin: undefined,
      createdAt: new Date()
    })
  },
  
  // this actually sends the message right now
  'message.send': ({projectId, channel_key, sender, recipients = [], payload, origin}) => {
    const userId = Meteor.userId()
    console.log('message.send', { payload, channel_key, recipients, sender, userId })
    const messageResult = Messages.insert({
      projectId,
      sender,
      recipients,
      channel_key,
      payload,
      origin,
      createdAt: new Date()
    })

    if (messageResult) {
      // TODO: there is no return value here, no way to report errors to admin?
      pushnotifications.send({ projectId, Meteor, recipients, payload })
    }
    
  },
  
  // schedules an event for later
  // execution is managed in project-server.js
  // delay is {minutes: 3, seconds: 30} from now
  // payload depends on type "message" or "moveTo" - see those methods
  'events.schedule': ({projectId, method, delay, payload}) => {
    let execTime;
    if(typeof delay == "object") execTime = add(new Date(), delay)
    if(typeof delay == "number") execTime = add(new Date(), {seconds: delay})
    if(!execTime) {
      console.log("invalid delay, not scheduling event")
      return;
    }
    console.log("events.schedule", delay, execTime)
    ScheduledEvents.insert({
      projectId,
      method,
      execTime,
      status: "scheduled",
      payload
    })
  },

  'events.setDone': ({_id}) => {
    ScheduledEvents.update({_id}, {$set: {status: "done"}})
  }

});
