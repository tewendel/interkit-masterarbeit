import { Meteor } from 'meteor/meteor';
import { Messages, Channels, ScheduledEvents } from '../imports/collections.js';
import { add, setHours, setMinutes, compareAsc } from 'date-fns'
import * as pushnotifications from '../imports/pushnotifications.js'

const isUserBlocked = () => {
  const userId = Meteor.userId()
  if (!userId) {
    console.warn('checkUserBlocked, but got no userId')
    return undefined
  }
  const user = Meteor.users.findOne(userId)
  if (!user) {
    console.warn('checkUserBlocked, got user not found with id ' + userId)
    return undefined
  }
  if (user.blocked) {
    console.warn('checkUserBlocked, user is blocked')
    return true
  }
}

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
      {
        projectId, 
        channel_key, 
        $or: [{sender: userId}, {recipients: userId}], 
        seen: {"$nin": [userId]}
      }, 
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
    if (isUserBlocked() === true) return
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
    if (isUserBlocked() === true) return
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
    if (isUserBlocked() === true) return
    const userId = Meteor.userId()
    const pushOnly = payload?.type === 'push'
    console.log('message.send', { payload, channel_key, recipients, sender, userId, pushOnly })
    let messageResult
    if (!pushOnly) {
      messageResult = Messages.insert({
        projectId,
        sender,
        recipients,
        channel_key,
        payload,
        origin,
        createdAt: new Date()
      })
    }
    if (pushOnly || messageResult) {
      // TODO: there is no return value here, no way to report errors to admin?
      pushnotifications.send({ projectId, Meteor, recipients, payload })
    }
  },

  'messages.block': async function ({ projectId, userIds, messageIds, setBlocked }) {
    let result
    console.log('messages.block', { userIds, messageIds, setBlocked })
    if (messageIds) {
      result = await Messages.update(
        { _id: { $in: messageIds } },
        { $set: { blocked: setBlocked } },
        { multi: true }
      )
    } else if (userIds) {
      result = await Messages.update(
        { sender: { $in: userIds } },
        { $set: { blocked: setBlocked } },
        { multi: true }
      )
    } else {
      console.error('provide either userIds or messageIds')
      result = false
    }
    return result
  },

  'messages.see': async function ({ messageIds, seenByUserId }) {
    let result = await Messages.update(
      { _id: { $in: messageIds } },
      { $push: { seen: seenByUserId } },
      { multi: true }
    )
    console.log('messages.see', { messageIds, seenByUserId, result })
    return result
  },

  'messages.delete': async function (ids) {
    console.log('messages.delete', ids)
    const result = await Messages.remove({ _id: { $in: ids } })
    return result
  },
  
  // schedules an event for later
  // execution is managed in project-server.js
  // delay is {minutes: 3, seconds: 30} from now, can be an (absolute) Date, too
  // payload depends on type "message" or "moveTo" - see those methods
  'events.schedule': ({ projectId, method, delay, payload }) => {
    /* check if affected user is in turbo mode */
    let affectedUserId
    let turboInfoChannelKey
    switch (method) {
      case 'message.send':
        affectedUserId = payload?.recipients?.length === 1
          ? payload.recipients[0]
          : false
        turboInfoChannelKey = payload?.channel_key
        break
      case 'user.setElementProperty':
        affectedUserId = payload?.userId
        break
      case 'user.moveTo':
        affectedUserId = payload?.userId
        turboInfoChannelKey = payload?.boardId
        break
    }
    const turboMode = affectedUserId
      ? Meteor.users.findOne(affectedUserId)
        ?.projectUserData?.[projectId]
        ?.userVars?.debugTurboMode
      : false
    let execTime = new Date()
    if (delay instanceof Date) {
      execTime = delay
    } else if (typeof delay === "object") {
      if (delay.nextHour) {
        let d = new Date(execTime)
        d = setHours(d, delay.nextHour)
        d = setMinutes(d, 0)
        if (delay.randomHours) {
          d = add(d, {
            // add doesn't like floats
            seconds: Math.round(Math.random() * delay.randomHours * 3600)
          })
        }
        // if setHours lands us "before now", we roll over to tomorrow
        if (compareAsc(execTime, d) === 1) {
          d = add(d, { days: 1 })
        }
        execTime = d
      } else {
        execTime = add(execTime, delay)
      }
    } else if (typeof delay === "number") {
      execTime = add(execTime, { seconds: delay })
    }
    if (!execTime) {
      console.log("invalid delay, not scheduling event")
      return
    }
    if (turboMode) {
      const turboInfo = `turbo mode - ${method} would happen ${execTime} actually`
      // send a system message, forgoing push
      Messages.insert({
        projectId,
        channel_key: turboInfoChannelKey,
        recipients: [affectedUserId],
        origin: 'handler',
        payload: { type: 'system', text: turboInfo },
        createdAt: new Date()
      })
      // reschedule
      execTime = add(new Date(), { seconds: 5 })
    }
    console.log("events.schedule", { method, delay, execTime, payloadType: payload?.type })
    return ScheduledEvents.insert({
      projectId,
      method,
      execTime,
      status: "scheduled",
      payload
    })
  },

  'events.setDone': ({_id}) => {
    ScheduledEvents.update({_id}, {$set: {status: "done"}})
  },

  'events.setStatus': ({ ids, status }) => {
    console.log('events.setStatus', { ids, status })
    const result = ScheduledEvents.update(
      { _id: { $in: ids } },
      { $set: { status } },
      { multi: true }
    )
    return result
  },

  'events.delete': async ids => {
    console.log('events.delete', ids)
    const result = await ScheduledEvents.remove({ _id: { $in: ids } })
    return result
  }

});
