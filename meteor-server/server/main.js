import { Meteor } from 'meteor/meteor';
import cors from 'cors'

require('dotenv').config( {
  path: `${process.env.PWD}/.env`
})


import '../imports/collections.js';
import {init as initUserActivity} from "../imports/userActivity.js";
import './publications';
import './userRolesSetup.js';

import './projectMethods.js';
import './sheetMethods.js';
import './userMethods.js';
import './chatMethods.js';

import { Projects } from '../imports/collections.js';
import { seedUser } from '../imports/userUtils.js';

Meteor.startup(() => {
  // code to run on server at startup

  // see if there is an admin user, otherwise seed one
  seedUser('admin', process.env.ADMIN_PASSWORD, 'admin');
  
  // seed author user
  seedUser('author', process.env.ADMIN_PASSWORD, 'author');

  // setup bundler user
  seedUser('bundler', process.env.BUNDLER_PASSWORD, 'bundler');

  // reset admin UI
  Projects.update(
    { projectServer: {$exists: true} }, 
    { $set: {"projectServer.actionRequested": null} }, 
    { multi: true }
  )

  //initUserActivity();

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
