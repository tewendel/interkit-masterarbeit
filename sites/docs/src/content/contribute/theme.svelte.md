<script>
  import StyleTokensTable from '/src/components/StyleTokensTable.svelte';
</script>

# How to create a custom theme

There are several levels of customization for a theme. See also [Styling](../guides/styling) for a general overview. 

A theme consists of these elements:
- settings for interkit style variables (file `src/styleTokens.json`)
- a customs css file (file `static/theme/global.css`)
- custom javascript (file `static/theme/global.js`)
- custom icons (files in `static/theme/icons/`)
- custom map style (URL)
- custom assets that are referenced in the css file (files in `static/theme/assets/`)
- a style guide that explains how to generate media assets that fit the theme

## Variables (easy + GUI)

Style variables are global variables that are used in all interkit components. You can start your theme by adjusting these variables. They are saved in the `src/styleTokens.json` file in your project. You can also edit this file directly. 

<details>
  <summary>
    <b>See the list of variables</b>
  </summary>
  <StyleTokensTable />
</details>

## Custom CSS (medium)

CSS knowledge required.

You can override the default CSS of the components by writing CSS in the app folder in `static/theme/global.css`. This file will be loaded after the default CSS, so you can override the default CSS.

See [Component CSS](/contribute/component-css) for more information on how to come up with appropriate CSS selectors.

### Custom assets

You can create a custom assets (`static/theme/assets`) folder and put your images, fonts, etc. in it.

You can then reference these assets in your `global.css`, for example as background images or use the `:before` and `:after` pseudo elements to add more images to the UI.

You can also import fonts this way.

## Custom Javascript (medium)

Required knowledge: Javascript.

You can also create a cusom javascript in `static/theme/global.js`.

## Custom Icons (medium)

there is a set of `svg` files in your app folder in `static/theme/icons`. You can replace these files with your own icons. The icons are referenced by their filename, so you need to keep the file names and formats.

## Map Style (medium)

You can also edit the map style using Map Tiler and reference it in the `<Map>` component

## Custom components (hard)

Required knowledge: Javascript, Svelte.

You can create your own components. This is the most powerful way to customize interkit apps. However, you cannot include custom components in themes yet. See [Components](../contribute/components)

## Style Recommendations

A general learning from our outdoor projects is that dark backgrounds do not work, mostly because of the reflections on the screen. We strongly recommend to use light backgrounds for versatile themes.
