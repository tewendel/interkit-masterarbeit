import { Meteor } from 'meteor/meteor';

const dotenv = require('dotenv')
dotenv.config( {
  path: `${process.env.PWD}/.env`
} )

import '../imports/collections.js';
import './publications.js';
import './methods.js';
import '../imports/methods.js';

Meteor.startup(() => {
  // code to run on server at startup
});
