<script>
  import StyleTokensTable from '/src/components/StyleTokensTable.svelte';
  import YouTube from "../../../components/YouTube.svelte"
</script>

# Changing the Appearance of your App

<YouTube url="https://www.youtube.com/embed/_2Z4GHrACcE?si=YecsqyftEp2VgANU"/> 

There are three ways to change the visual appearance of your app:

1. Through your uploaded media assets
2. Styling the Base Design
3. Theming

## Media

Your media files have a huge influence on the atmosphere of your app. It's a way to change the appearance without going into technical details. You can upload your own media files in the `Media` section of the authoring system.

Think about, for example:

- colors: vivid colors, pastel colors, black and white, ...
- style: realistic, cartoon, pictures, fictionalized, ...
- backgrounds: light, dark, transparent, ...
- meaning: descriptive images, abstract images, ...

## Map Styles

If your project uses a Map, you can change the appearence and style of the map layers. See [Map Component Reference](/reference/components/MapSimple)

## Styling

Interkit comes with a set of variables that define the appearance of the Base Design. They are used throughout all components.

They let you define

- colors
- fonts
- spacings
- ...

<details>
  <summary>
    <b>See the list of variables</b>
  </summary>
  <StyleTokensTable />
</details>

You can change these variables visually in the `Design` section of the authoring system. When you press "Save", a file called `styleTokens.json` is saved in your project. It contains all the values of your variables (You can also edit this file directly).

For example, if you change "Color / Text" in the "general" section, it changes the color text all over your app.

Press the "trashcan" to reset the variables to the default values.
Press the "undo" icon to revert to the last saved version.

### Using the Styling Component (advanced)

The styles that are defined in the "Styling" section of the Redaktionssystem are applied automatically to all parts of your app.

However, you can also style parts of the app differently using the `<Styling>` component. It opens the same style editor, but applies the values only to all it's child components.

Some example usages:

- There is a tab in your app that is in fiction and another one that is out of fiction. You can put the tab content that is in fiction in another style, for example a dark background and fancy font, while the rest of you app appears clearly different.
- There is a special button that you want to emphasize. You can out it into the `<Styling>` component and make it stand out, for example with a shadow and big font.

## Theming

While **Styling** lets you change the values of a set of built-in variables, **Theming** is a way to extend and modify the appearence of an app in a deeper and more flexible way.

### Applying a predefined theme

Interkit comes with some predefined themes from renowned design agencies:

| Name             |   Author      |  Details      |
|------------------|---------------|---------------|
| Building Blocks  | Knoth & Renner| [README.md](https://gitlab.interkit.app/interkit/interkit-experiments/-/tree/v04/repositories/themes/knoth-renner) |
| Studio S/M/L     | Studio S/M/L  | [README.md](https://gitlab.interkit.app/interkit/interkit-experiments/-/tree/v04/repositories/themes/studio-sml) |

Use the Sidebar in the `Design` Tab to apply the themes to your project.

Note that whenever you apply a theme, it overwrites any existing theme files. Applying a theme actually just copies the theme's files into the `static/theme` folder of your app. 

### Customizing 

For full customization, see [Theming](/guides/contribute/theme)
