import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import cors from 'cors'

require('dotenv').config( {
  path: `${process.env.PWD}/.env`
})


import '../imports/collections.js';
import './publications.js';
import './methods.js';

Meteor.startup(() => {
  // code to run on server at startup

  // see if there is an admin user, otherwise seed one
  if (Meteor.users.find({ username: 'admin' }).count() == 0) {
    console.log('seeding admin user');
    Accounts.createUser({
      username: 'admin',
      password: `${process.env.ADMIN_PASSWORD}`,
    });
  } else {
    if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length && process.env.ADMIN_PASSWORD.length > 0 ) {
      // always override admin password with password from ENV
      Accounts.setPassword(Accounts.findUserByUsername("admin"), process.env.ADMIN_PASSWORD, { logout: false })
    }
  }


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
