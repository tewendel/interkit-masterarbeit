import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import cors from 'cors'

require('dotenv').config( {
  path: `${process.env.PWD}/.env`
})


import '../imports/collections.js';
import './publications.js';
import './methods.js';

import { Projects } from '../imports/collections.js';

function seedUser(username, password) {
  if (Meteor.users.find({ username }).count() == 0) {
    console.log('seeding admin user');
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
}

Meteor.startup(() => {
  // code to run on server at startup

  // see if there is an admin user, otherwise seed one
  seedUser('admin', process.env.ADMIN_PASSWORD);
  seedUser('bundler', process.env.BUNDLER_PASSWORD);

  // reset admin UI
  Projects.update(
    { projectServer: {$exists: true} }, 
    { $set: {"projectServer.actionRequested": null} }, 
    { multi: true }
  )

});


/* setup express server for upload post route */
import { WebApp } from 'meteor/webapp';
import express from 'express';
import { setupMediaServer } from '../imports/mediaServer.js';
import { setupExportServer } from '../imports/exportServer.js'
import { setupImportServer } from '../imports/importServer.js'
const app = express();
app.use(cors());
app.options('*', cors())
setupMediaServer(app);
setupExportServer(app);
setupImportServer(app);
//WebApp.accessRule('*');
WebApp.connectHandlers.use(app);
