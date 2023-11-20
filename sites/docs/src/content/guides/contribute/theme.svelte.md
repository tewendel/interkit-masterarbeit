<script>
  import StyleTokensTable from '/src/components/StyleTokensTable.svelte';
  import InterkitComponent from '/src/components/InterkitComponent.svelte'
  import ComponentInfo from '/src/components/ComponentInfo.svelte'
</script>

# How to create a custom theme

There are several levels of customization for a theme. See also [Styling](/guides/howto/styling) for a general overview. 

A theme consists of these elements:
- a customs css file (file `static/theme/global.css`)
- custom javascript (file `static/theme/global.js`)
- custom map style (URL)
- custom assets that are referenced in the css file (files in `static/theme/assets/`), such as icons, background images, etc.
- a style guide that explains how to generate media assets that fit the theme

The files need to be places in the `static/theme` folder of your project. Themes are mostly project-specific at this point. The `Design` provides access to the installed theme.

## Examples

Check the [themes folder](https://gitlab.interkit.app/interkit/interkit-experiments/-/tree/v04/repositories/themes) in the interkit repository for some examples!

## Style Variables

Style variables are global variables that are used in all interkit components. You can start your theme by adjusting these variables. They are saved in the `src/styleTokens.json` file in your project. You can also edit this file directly.

<details>
  <summary>
    <b>See the list of variables</b>
  </summary>
  <StyleTokensTable />
</details>

The values are not part of the theme, but you can override the values in your theme. Check the source code of the <InterkitComponent name="Styling" /> component Example:

```css
:root {
  --colorText: #f00;
}
```

<details>
<summary>
<InterkitComponent name="Styling" /> source code
</summary>
<ComponentInfo noheader component="Styling" />
</details>

## Custom CSS

CSS knowledge required.

You can override the default CSS of the components by writing CSS in the app folder in `static/theme/global.css`. This file will be loaded after the default CSS, so you can override the default CSS.

See [Component CSS](/contribute/component-css) for more information on how to come up with appropriate CSS selectors. Use `#Theming` to raise the specificity. Example:

```css
#Theming .Icon {
  border: 1px solid black;
}
```

Loading of `static/theme/global.css` can be toggled using "Load Theme" in the settings of the Preview.

### Custom assets

You can create a custom assets (`static/theme/assets`) folder and put your images, fonts, etc. in it.

You can then reference these assets in your `global.css`, for example as background images or use the `:before` and `:after` pseudo elements to add more images to the UI.

You can also import fonts this way.

## Custom Javascript

Required knowledge: Javascript.

You can also create a cusom javascript in `static/theme/global.js`.

## README.md

You can add a description to your theme that will show up in the interface. Use frontmatter to add metadata. Example:

```markdown
---
name: My theme
version: 0.1
slug: my-theme
---

# A custom theme just for this project

Description on what it does and how to use it

```

## Custom Icons

Required Knowledge: CSS.

To use custom Icons, generate your own assets and put the into `static/theme/icons`. The use CSS to override the icons from the <InterkitComponent name="Icon" /> component. The source code lists a number of icon names you can override.

<details>
<summary>
<InterkitComponent name="Icon" /> source code
</summary>
<ComponentInfo noheader component="Icon" />
</details>

## Map Style

You can also edit the map style using Map Tiler and reference it in the <InterkitComponent name="Map" /> component

## Custom components

Required knowledge: Javascript, Svelte.

You can create your own components. This is the most powerful way to customize interkit apps. However, you cannot include custom components in themes yet. See [Components](../contribute/components)

## Style Recommendations

A general learning from our outdoor projects is that dark backgrounds do not work, mostly because of the reflections on the screen. We strongly recommend to use light backgrounds for versatile themes.
