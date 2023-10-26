import { Meteor } from "meteor/meteor";
import { Themes } from "../../imports/collections.js";

/**
 * @method theme.setDefaultThemes
 * @param {Array} themesMeta
 * @returns {Boolean} success
 * @summary Set the default themes, erase previously existing themes
 */

Meteor.methods({
  "theme.setDefaultThemes": async ({ themesMeta }) => {
    console.log("theme.setDefaultThemes", themesMeta);

    Themes.remove({});

    for (let themeMeta of themesMeta) {
      Themes.insert(themeMeta);
    }

    return true;
  },
});
