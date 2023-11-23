<script>
  import StyleTokensTable from '/src/components/StyleTokensTable.svelte';
  import InterkitComponent from '/src/components/InterkitComponent.svelte'
  import ComponentInfo from '/src/components/ComponentInfo.svelte'
</script>

# How to create a custom theme

## Table of contents

There are several levels of customization for a theme. See also [Styling](/guides/quick-start/styling) for a general overview. 

A theme consists of these elements:
- a customs css file (file `static/theme/global.css`)
- custom javascript (file `static/theme/global.js`)
- custom map style (URL)
- custom assets that are referenced in the css file (files in `static/theme/assets/`), such as icons, background images, etc.
- a style guide that explains how to generate media assets that fit the theme

The files need to be places in the `static/theme` folder of your project. Themes are mostly project-specific at this point. The `Design` provides access to the installed theme.

## Examples

### Example Theme / Theme Starter

There is an example theme that demonstrates all the possibilities.

The easiest way to start a new theme in a project is to go to the `Design` tab and install the "example" theme.

Then go to the `Repository` tab and edit the files.

### Predefined themes

The example theme is just one of the predefined themes that Interkit comes with.

Check the [themes folder](https://gitlab.interkit.app/interkit/interkit-experiments/-/tree/v04/repositories/themes) in the interkit repository for the source code of all predefined themes and see how they are made!

## Techniques of Customization in a Theme

### Custom CSS

CSS knowledge required.

You can override the default CSS of the components by writing CSS in the app folder in `static/theme/global.css`. This file will be loaded after the default CSS, so you can override the default CSS.

See [Component CSS](/contribute/component-css) for more information on how to come up with appropriate CSS selectors. Use `#Theming` to raise the specificity. Example:

```css
#Theming .Icon {
  border: 1px solid black;
}
```

Loading of `static/theme/global.css` can be toggled using "Load Theme" in the settings of the Preview.

#### Custom assets

You can create a custom assets (`static/theme/assets`) folder and put your images, fonts, etc. in it.

You can then reference these assets in your `global.css`, for example as background images or use the `:before` and `:after` pseudo elements to add more images to the UI.

You can also import fonts this way.

#### Style Variables

Style variables are global variables that are used in all interkit components. You can start your theme by adjusting these variables. They are saved in the `src/styleTokens.json` file in your project. You can also edit this file directly.

<details>
  <summary>
    <b>See the list of variables</b>
  </summary>
  <StyleTokensTable />
</details>

The values are not part of the theme, but you can override the values in your theme. Check the source code of the <InterkitComponent name="Styling" /> component Example:

```css
#Theming * {
  --color-text: rgb(0, 0, 0);
}
```

<details>
<summary>
<InterkitComponent name="Styling" /> source code
</summary>
<ComponentInfo noheader component="Styling" />
</details>

### Custom Javascript

Required knowledge: Javascript.

You can also create a cusom javascript in `static/theme/global.js`.

### README.md

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

### Custom Icons

Required Knowledge: CSS.

To use custom Icons, generate your own assets and put the into `static/theme/icons`. Use CSS to override the icons from the <InterkitComponent name="Icon" /> component. Example:

```css
#Theming .icon-Full-Camera       { background-image: url("icons/Full/Camera.svg"); }
```

The source code lists a number of icon names you can override.

<details>
<summary>
<InterkitComponent name="Icon" /> source code
</summary>
<ComponentInfo noheader component="Icon" />
</details>

### Map Style

You can also edit the map style using Map Tiler and reference it in the <InterkitComponent name="Map" /> component

### Custom components

Required knowledge: Javascript, Svelte.

You can create your own components. This is the most powerful way to customize interkit apps. However, you cannot include custom components in themes yet. See [Components](../contribute/components)

## Style Recommendations

A general learning from our outdoor projects is that dark backgrounds do not work, mostly because of the reflections on the screen. We strongly recommend to use light backgrounds for versatile themes.

## Development workflows

### Create a custom theme for an existing project

1. Go to the `Design` tab and apply the `Example Starter` theme
2. Go to the `Repository` tab and commit the changed to set a baseline to return to
3. Edit the files in `static/theme`
    - either directly in the `Repository/Files` tab
    - locally with git (see below)

### Create a theme to share and to contribute to interkit

1. Clone the `Maxi` template
2. Go to the `Design` tab and apply the `Example Starter` theme
3. Go to the `Repository` tab and commit the changed to set a baseline to return to
4. Edit the files in `static/theme` locally with git (see below)
5. Test the theme with different projects and templates:
    - locally
        1. clone a project locally with git (see below) and manually copy the `static/theme` folder into the cloned project
        2. test and iterate
        3. Dont's git push because that would change the template
    - OR on interkit
        1. dumplicate a template
        2. Go to `Repository/Files` and copy the theme folder into the project
        3. Tets and iterate, then download the improved theme from the folder
    - OR if you have a local interkit running
        1. copy the theme to `repositories/themes` and restart interkit
        2. duplicate template project and press `apply this theme`. Whenever you press this button, interkit copies the contents of the theme's folder into the project. This way you can easily test a change on a range of projects.
6. Once the theme works fine on a range of different projects, copy it into the interkit repository in `repositories/themes`

### Local git workflow

You can clone an interkit project and work on it locally. You can also clone a template.

1. Go to the `Repository/GIT` tab and find the URL for cloning
2. `git clone <URL from 1.>`
3. install interkit package, the tab should provide an exact URL `npm install https://...`
4. `npm run dev`
5. Edit files in `static/theme`
    - you need to manually reload to enable changes
    - you can make git commits and push if this is your own project
    - do not push if this is a template
