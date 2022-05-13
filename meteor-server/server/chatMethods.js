import { Meteor } from 'meteor/meteor';
import { Projects, Sheets, Rows, Messages, Channels } from '../imports/collections.js';
import { duplicateProject, exportProject, makeProjectHistoryEntry } from '../imports/projectUtils.js'
import { v4 as uuidv4 } from 'uuid';
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
  
});
