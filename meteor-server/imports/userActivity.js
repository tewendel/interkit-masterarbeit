import { Meteor } from "meteor/meteor";
import { Projects } from "./collections.js";

const pruneTimeout = 1000 * 30// 30 seconds

const urlEditingProjectRegex = /\/#\/([a-zA-Z0-9]+)/; // matches /#/projectid => a project being edited

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

const resetViteServers = async () => {
  // reset viteServer.actionRequested on all projects if it exists
  await Projects.update(
    {},
    { $set: { ["viteServer.actionRequested"]: null } },
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
  
  // (optimization) start vite server if a project is being edited by this user
  if (url.match(urlEditingProjectRegex)) {
    const projectId = url.match(urlEditingProjectRegex)[1];
    Projects.update(
      { _id: projectId, ["viteServer.actionRequested"]: { $ne: "start" } },
      { $set: { ["viteServer.actionRequested"]: "start" } }
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

const updateAllViteServerStatus = async () => {
  // find all users that have connections whose url match urlEditingProjectRegex
  const users = await Meteor.users.find(
    { "connections.url": { $regex: urlEditingProjectRegex } },
    { fields: { connections: 1 } }
  ).fetch();

  console.log("updateAllViteServerStatus", users)

  // find all projectIds of projects being edited
  const projectIds = users.reduce((acc, user) => {
    const projectIds = user.connections
      .filter((c) => c.url.match(urlEditingProjectRegex))
      .map((c) => c.url.match(urlEditingProjectRegex)[1]);
    return [...acc, ...projectIds];
  }, []);
  //console.log("updateAllViteServerStatus", projectIds)
  
  // request to start vite server for all projects being edited
  Projects.update(
    { _id: { $in: projectIds } },
    { $set: { ["devServer.actionRequested"]: "start" } },
    { multi: true }
  );
  
  // request to stop vite server for all projects not being edited
  Projects.update(
    { _id: { $nin: projectIds } },
    { $set: { ["devServer.actionRequested"]: "stop" } },
    { multi: true }
  );
};

await resetUsers();
await resetViteServers();

Meteor.setInterval( async function(){
  await pruneConnections();
  await updateAllViteServerStatus()
}, 10000);

export { processUserActivity, urlEditingProjectRegex };

