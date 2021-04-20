import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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
  }


});


/* setup express server for upload post route */
import { WebApp } from 'meteor/webapp';
import express from 'express';
import { setupMediaServer } from '../imports/mediaServer.js';
import { setupExportServer } from '../imports/exportServer.js'
import { setupImportServer } from '../imports/importServer.js'
const app = express();
setupMediaServer(app);
setupExportServer(app);
setupImportServer(app);
//WebApp.connectHandlers.use(cors({origin:false}));
//WebApp.accessRule('*');
WebApp.connectHandlers.use(app);
