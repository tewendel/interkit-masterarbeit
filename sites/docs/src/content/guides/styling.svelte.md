# Styling: Changing the visual appearance of an app

There are three ways to change the visual appearance of your app:

1. Through your uploaded media assets
2. Styling
3. Theming

## Media

Your media files have a huge influence on the atmosphere of your app. It's a way to change the appearance without going into technical details. You can upload your own media files in the `Media` section of the Redaktionssystem.

Think about, for example: 
- colors: vivid colors, pastel colors, black and white, ...
- style: realistic, cartoon, pictures, fictionalized, ...
- backgrounds: light, dark, transparent, ...
- meaning: descriptive images, abstract images, ...

## Styling

Interkit comes with a set of variables that define the appearance of the components. They are used throught all components. 

They let you define

- colors
- fonts
- spacings
- ...

You can change these variables visually in the `Styling` section of the Redaktionssystem. When you press "Save", a file called `styleTokens.json` is saved in your project. It contains all the values of your variables (You can also edit this file directly).

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

--> [Theming](../contribute/theme)