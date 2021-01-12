import { Mongo } from 'meteor/mongo';
export const Projects = new Mongo.Collection('projects');
export const Sheets = new Mongo.Collection('sheets');
export const Rows = new Mongo.Collection('rows');