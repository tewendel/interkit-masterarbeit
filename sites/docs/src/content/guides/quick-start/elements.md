# Working with Data and Components

## Define your data

Most apps have a main database `sheet` that defines the central elements that will be used in the app.

Examples:
- Objects that can be found in places in the city
- Artworks to discover in the exhibition
- Places to visit

It's a good way to start by identifying the core "elements" of your project.

![Example elements sheet](/images/elements_sheet.png "Example elements sheet")

## Build the user interface with Components

Components define the structure of the UI of the app. Start the app with the `AppBase` component. You can look up the documentation for all components by right clicking on them and clicking on `help`. Common design patterns are covered in the [tutorial](/guides/tutorial/intro).

## Connect your components to the database

If you want to display data from the database, you need to load it with special components such as [DataLoaderSingle](/reference/components/DataLoader).

## Divide your app into different screens and set up navigation

Use [Route](/reference/components/Route) components to define different screens that the user can navigate to inside your app. To allow a user to navigate to a different route, use the effect property on interactice components like [Button](/reference/components/Button).

## Updating your app

Whenever you change something in the component structure, you need to press the `Save` button for changes to become effective in the app preview section.

The `Publish` button does the same, but makes the structural changes visible to visitors of your app. It also generates a link to test the app on your mobile device.

Important: Changes in the database do not need to be explicitly published, they update immediately.

