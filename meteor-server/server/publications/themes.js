import { Meteor } from "meteor/meteor";
import { Themes } from "../../imports/collections.js";

Meteor.publish("themes", () => {
  let query = {};
  console.log("themes sub with query", query);
  let themes = Themes.find(query);
  return themes;
});
