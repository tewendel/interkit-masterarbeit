import { Meteor } from 'meteor/meteor';
import {userIsInRoles} from '../../imports/userRoles.js';
import { publishVirtualWithMeta } from '../../imports/publicationUtils.js';

// used by project server
Meteor.publish("projectUsers", ({projectId}) => {
  const cursor = Meteor.users.find({ [`projectUserData.${projectId}`] : { $exists:true }}, { fields: { services: false } });
  console.log("publish projectUsers", projectId, cursor.count())
  //console.log(this)
  return cursor
});

// used by admin
Meteor.publish('projectUsersPaginated', function({
  projectId, 
  skip=0, 
  limit=1, 
  searchQuery="", 
  sortKey = "createdAt", 
  sortDirection = -1
}) {
  const allowedSortKeys = ["createdAt", "username", "blocked", "projectUserData.userToken"];
  const query = { 
    [`projectUserData.${projectId}`] : { $exists:true },
    ...searchQuery && {$or: [
      // search in id
      {_id: { $regex: searchQuery, $options: 'i' }},
      // search in username
      {username: { $regex: searchQuery, $options: 'i' }},
      // search in userToken
      {[`projectUserData.${projectId}.userToken`]: { $regex: searchQuery, $options: 'i' }},
      // search in names of userVars (exact match only!)
      {[`projectUserData.${projectId}.userVars.${searchQuery}`] : { $exists:true } },
      // search in values of userVars (credits: ChatGPT)
      {
        $and: [
          { "projectUserData": { $exists: true } },
          { [`projectUserData.${projectId}.userVars`] : { $ne: null } }
        ],
        $expr: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: { $objectToArray: `$projectUserData.${projectId}.userVars` },
                  as: "item",
                  cond: { $regexMatch: { input: { $toString: "$$item.v" }, regex: searchQuery, options: "i" } }
                }
              }
            },
            0
          ]
        }
      }
    ]},
  }

  const options = { 
    ...allowedSortKeys.includes(sortKey) && [1,-1].includes(parseInt(sortDirection)) && {sort: {[sortKey]: parseInt(sortDirection)}},
    fields: { services: false },
  }
  
  const cursor = Meteor.users.find(query, { ...options, skip, limit });
  const countCursor = Meteor.users.find(query)

  //console.log("publish projectUsersPaginated", projectId, skip, limit, searchQuery, sortKey, sortDirection, cursor.count())
  return publishVirtualWithMeta(this, 'projectUsersPaginated', cursor, countCursor);
})

Meteor.publish("user.projectUserData", ({ projectId }) => {
  const cursor = Meteor.users.find(Meteor.userId(), { fields: { [`projectUserData.${projectId}`]: true } });
  console.log("user.projectUserData", Meteor.userId(), projectId)
  return cursor
});

Meteor.publish("user", ({ projectId }) => {
  const cursor = Meteor.users.find(Meteor.userId());
  return cursor
});

Meteor.publish("user.bundler.status", () => {
  const cursor = Meteor.users.find({ username: 'bundler' }, { fields: { 'status': true, username: true } });
  return cursor
});

// publish roleAssignments
Meteor.publish("roleAssignment", function () {
  if (this.userId) {
    if (userIsInRoles(this.userId, ['admin'])) {
      // console.log("publishing ALL roleAssignments to admin user ", this.userId)
      return Meteor.roleAssignment.find({});
    } else {
      // console.log("publishing LIMITED roleAssignments to user ", this.userId)
      return Meteor.roleAssignment.find({ 'user._id': this.userId });
    }
  } else {
    this.ready()
  }
})

Meteor.publish("user.editingProject", function ({ projectId }) {
  if (this.userId && projectId) {
    if (userIsInRoles(this.userId, ['admin', 'author'])) {
      // find user that have entries in connection urls that match "/#/[projectId]"
      // connections: [{url: "/#/projectId", ...}]
      const regex = `\/#\/${projectId}`;

      const cursor = Meteor.users.find({
        connections: {
          $elemMatch: {
          url: { $regex: regex },
          },
        },
      })
        
      return cursor
    } else {
      // console.log("user.editingProject: not authorized", this.userId)
    }
  } else {
    // console.log("user.editingProject: missing userId or projectId", this.userId, projectId)
  }
  this.ready()
})