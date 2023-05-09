# How to start

## Define your "elements"

Most apps have a `elements sheet` that defines the central elements that will be used in the app.

Examples:
- Objects that can be found in places in the city
- Artworks to discover in the exhibition
- Places to visit

It's a good way to start by identifying the core "elements" of your project.

![Example elements sheet](/images/elements_sheet.png "Example elements sheet")

## Build the user interface with Components

Components define the structure of the UI of the app. Start the app with the `AppBase` component.

### Component Actions

Component Actions are required for more complex interactions between components in the user interface.

Examples:
- Tap on "Help" opens a submenu on the menu overlay
- Navigation from a details view of an element to its entry on the map

### "Building" an App

Whenever you change something in the component structure, you need to press the "Save" button for changes to become effective in the app preview section.

The "Build App" button does the same, but also generates a link to test the app on your mobile device or the interkit playground app.

Changes in the database do not need a rebuild, they update immediately.

