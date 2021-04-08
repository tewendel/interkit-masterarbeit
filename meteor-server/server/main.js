import { Meteor } from 'meteor/meteor';

const dotenv = require('dotenv')
dotenv.config( {
  path: `${process.env.PWD}/.env`
} )

import '../imports/collections.js';
import './publications.js';
import './methods.js';

Meteor.startup(() => {
  // code to run on server at startup
});


/* setup express server for upload post route */
import { WebApp } from 'meteor/webapp';
import express from 'express';
import { setupMediaServer } from '../imports/mediaServer.js';
const app = express();
setupMediaServer(app);
WebApp.connectHandlers.use(app);
