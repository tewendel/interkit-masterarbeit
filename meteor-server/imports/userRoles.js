import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export function createRoleIdempotent(role) {
  if(!Meteor.roles.findOne(role)) {
    Roles.createRole(role);
  }
}

export function addUsersToRoles(users, roles, scopes=null) {
  //console.log("addUsersToRoles", users, roles, scopes)
  return Roles.addUsersToRoles(users, roles, scopes)
}

export function userIsInRoles(users, roles, scopes=null) {
  //console.log("userIsInRoles", users, roles, scopes)
  return Roles.userIsInRole(users, roles, scopes)
}