import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import {addUsersToRoles, userIsInRole} from '../imports/userRoles.js';

function seedUser(username, password, role) {
  if (Meteor.users.find({ username }).count() == 0) {
    console.log('seeding user "' + username + '"');
    Accounts.createUser({
      username,
      password,
    });
  } else {
    if (password) {
      // always override admin password with password from ENV
      Accounts.setPassword(Accounts.findUserByUsername(username)._id, password, { logout: false })
    }
  }
  if (role) {
    let user = Accounts.findUserByUsername(username)
    if (user) {
      addUsersToRoles(user, role);
    }
  }
}

export {
  seedUser,
}