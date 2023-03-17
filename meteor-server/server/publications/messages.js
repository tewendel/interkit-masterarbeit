import { Meteor } from 'meteor/meteor';
import { Messages } from '../../imports/collections.js';
import { publishVirtualWithMeta } from '../../imports/publicationUtils.js';
import { userIsInRoles } from '../../imports/userRoles.js';

Meteor.publish("messages", ({
  projectId, 
  channel_key, 
  origin, 
  userId, 
  limit, 
  includeBlocked
}) => {
  let query = {projectId};
  if (channel_key) {
    query.channel_key = channel_key;
  }

  if (!includeBlocked) {
    query.blocked = { $ne: true }
  }

  if (userId) {
    query.$or = [
      {sender: userId}, 
      {recipients: userId} 
    ]
  }
  if (origin) {
    query.origin = origin;
  }
  
  let options = {
    sort: {createdAt: -1}
  }

  if(limit) {
    options.limit = limit;
  }
  
  console.log("message sub with", query, options)

  let messages = Messages.find(query, options);
  return messages;
});

Meteor.publish('messagesPaginated', function({
    projectId, 
    skip=0, 
    limit=1, 
    searchQuery="", 
    sortKey = "createdAt", 
    sortDirection = -1
  }) {

  if (!userIsInRoles(this.userId, ['admin', 'author'])) {
    return null;
  }

  const allowedSortKeys = [
    "createdAt", 
    "blocked", 
    "channel_key", 
    "sender", 
    "payload.type",
  ];

  const cursor = Messages.find({ 
    projectId,
    ...searchQuery && {$or: [
      // search in id (exact match only!)
      { _id: searchQuery },
      // search in sender (exact match only!)
      { sender: searchQuery },
      // search in channel_key (exact match only!)
      { channel_key: searchQuery },
      // search in content
      { "payload.text": { $regex: searchQuery, $options: 'i' }},
      // search in array of recipients (exact match only!)
      { recipients: searchQuery },
    ]},
  }, { 
    ...allowedSortKeys.includes(sortKey) && [1,-1].includes(parseInt(sortDirection)) && {sort: {[sortKey]: parseInt(sortDirection)}},
    fields: { services: false },
    skip,
    limit
  }) 

  //console.log("publish projectUsersPaginated", projectId, skip, limit, searchQuery, sortKey, sortDirection, cursor.count())
  return publishVirtualWithMeta(this, 'messagesPaginated', cursor);
})

Meteor.publish("messages.last", ({projectId, channel_key, userId, includeBlocked}) => {
  console.log("subscribing to messages.last with", projectId, channel_key, userId, includeBlocked)
  let query = {
    projectId,
    channel_key,
    "payload.type": { $in: ["text", "image", "video", "audio"] },
    $or: [{ sender: userId }, { recipients: userId }]
  }
  if (!includeBlocked) {
    query.blocked = { $ne: true }
  }
  let options = {
    sort: {createdAt: -1},
    limit: 1
  }

  //console.log("messages.last", query, options)

  let messages = Messages.find(query, options);

  //console.log(messages.fetch())

  return messages;
});

// used by raspi script
Meteor.publish(
  "messages.latest.forMe",
  ({ projectId = null } = {}) => {

    const userId = Meteor.userId();

    if (!userId) {
      console.warn(`missing user for publication messages.latest.forMe`);
      return null;
    }

    if (!projectId) {
      console.warn(`missing projectId for publication messages.latest.forMe`);
      return null;
    }

    let query = {
      projectId,
      recipients: userId
    };

    let options = {
      sort: { createdAt: -1 },
      limit: 1,
    };

    let messages = Messages.find(query, options);

    //console.log(messages.fetch())

    return messages;
  }
);

Meteor.publish("messages.unseen", ({projectId, channel_key, userId, includeBlocked}) => {
  let query = {
    projectId,
    channel_key,
    seen: {"$nin": [userId]},
    $or: [{ sender: userId }, { recipients: userId }]
  }
  if (!includeBlocked) {
    query.blocked = { $ne: true }
  }
  let options = {
    //sort: {createdAt: -1},
    //fields: {_id:1, channel_key: 1, seen: 1}
  }
  let messages = Messages.find(query, options);
  //console.log("messages.unseen", messages.fetch())
  return messages;
});


Meteor.publish("messages.unhandled", ({projectId, includeBlocked}) => {
  let query = {
    projectId,
    handledAt: { $exists: false },
    origin: { $not: { $in: ["handler"] } }
  }
  if (!includeBlocked) {
    query.blocked = { $ne: true }
  }
  let messages = Messages.find(query, {sort: {createdAt: -1}});
  // console.log("messages.unhandled count: " + messages.count(), messages.fetch())
  return messages;
});