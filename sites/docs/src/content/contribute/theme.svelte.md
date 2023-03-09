# How to create a custom theme

There are several levels of customization for a theme

### Variables (easy)

Interkit comes with a set of variables that define the appearance of the components. They let you define
- colors
- fonts
- spacings

### Custom assets (medium)

Required knowledge: Graphic design.

You can create a custom assets folder and put your icons, images, fonts, etc. in it. This lets you override the default icons and fonts. 

You can also use these assets for background images (using custom CSS) or use the `:before` and `:after` pseudo elements to add more images to the UI.

### Custom CSS (medium)

CSS knowledge required.

You can override the default CSS of the components by creating a custom CSS file `global.cs`. This file will be loaded after the default CSS, so you can override the default CSS.

See [Component CSS](/contribute/component-css) for more information on how to design the selectors.

### Custom Javascript (medium)

You can also create a cusom javascript file called `global.js`.

## Custom components (hard)

Required knowledge: Javascript, Svelte.

You can create your own components. This is the most powerful way to customize interkit apps. However, you cannot include custom components in themes yet.

## Style Recommendations

A general learning from our outdoor projects is that dark backgrounds do not work, mostly because of the reflections on the screen. We strongly recommend to use light backgrounds for versatile themes.
