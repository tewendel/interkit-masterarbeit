import { Meteor } from 'meteor/meteor';
import {userIsInRoles} from '../../imports/userRoles.js';
import { publishVirtualWithMeta } from '../../imports/publicationUtils.js';

Meteor.publish("projectUsers", ({projectId}) => {
  const cursor = Meteor.users.find({ [`projectUserData.${projectId}`] : { $exists:true }}, { fields: { services: false } });
  console.log("publish projectUsers", projectId, cursor.count())
  //console.log(this)
  return cursor
});

Meteor.publish('projectUsersPaginated', function({
  projectId, 
  skip=0, 
  limit=1, 
  searchQuery="", 
  sortKey = "createdAt", 
  sortDirection = -1
}) {
  const allowedSortKeys = ["createdAt", "username", "blocked", "projectUserData.userToken"];
  const cursor = Meteor.users.find({ 
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
  }, { 
    ...allowedSortKeys.includes(sortKey) && [1,-1].includes(parseInt(sortDirection)) && {sort: {[sortKey]: parseInt(sortDirection)}},
    fields: { services: false },
    skip,
    limit
  });
  //console.log("publish projectUsersPaginated", projectId, skip, limit, searchQuery, sortKey, sortDirection, cursor.count())
  return publishVirtualWithMeta(this, 'projectUsersPaginated', cursor);
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
