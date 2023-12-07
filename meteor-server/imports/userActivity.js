import { Meteor } from "meteor/meteor";
import { Projects } from "./collections.js";

const pruneTimeout = 1000 * 60 // 1 minute

/*
 * expected data structure in Meteor.users:
 * {
 *  ...
 *  connections: [
 *   {
 *    connectionId: "cijcujG8uf78H4SZZ",
 *    url: "http://localhost:3000/#/o9gxtpDydkDKSm4wm/chat",
 *    lastSeen: "2021-05-04T15:00:00.000Z"
 *   },
 *   {
 *     ...
 *   }
 *  ]
 */

const resetUsers = async () => {
  // reset user.connections on all users if it exists
  await Meteor.users.update(
    { }, // TODO optimize this selector
    { $set: { connections: [] } },
    { multi: true }
  );
};


const processUserActivity = async ({userId, connectionId, url}) => {
  // update user.connections
  const object = {
    connectionId,
    url,
    lastSeen: new Date(),
  };
  // update the existing entry 
  const result = await Meteor.users.update(
    { _id: userId, "connections.connectionId": connectionId },
    { $set: { "connections.$": object } }
  );
  // if no entry was updated, insert a new one
  if (result === 0) {
    await Meteor.users.update(
      { _id: userId },
      { $push: { connections: object } }
    );
  }
}

const pruneConnections = async () => {
  // delete user.connections.connectionId where connections.connectionId.lastSeen is older than pruneTimeout
  await Meteor.users.update(
    // select those that have > 0 connections
    { "connections.0": { $exists: true } },
    // delete connectionId from connections array
    {
      $pull: {
        connections: { lastSeen: { $lt: new Date(Date.now() - pruneTimeout) } },
      },
    },
    { multi: true }
  );
  // Meteor.users.find({ "connections": { $elemMatch: { "lastSeen": { $lt: "2023-09-07T06:35:05.255Z" } } } });
};


const init = async () => {
  await resetUsers();

  Meteor.setInterval( async function(){
    await pruneConnections();
  }, 10000);
}

export { processUserActivity, urlEditingProjectRegex, init };

