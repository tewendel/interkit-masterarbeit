<script>
  import YouTube from "../../../components/YouTube.svelte"
</script>

# Build an App with Components

<YouTube url="https://www.youtube.com/embed/uzoBi1_Oa00?si=wRaM9TMtRZ9W8FuV"/> 

### What are components

Components define the structure of the User Interface (UI) of the app, for example lists, navigation, or more complex things like a map. 

Every App needs to start with the `AppBase` component. 

Drag components onto the workspace from the left sidebar. They snap onto each other.

You can look up the documentation for all components by right clicking on them and clicking on `help` or by browsing the components section in the [reference](/reference). Through the right click context menu you can also duplicate components and whole constellations of blocks.

Tip: Use the [Group and GroupConnector](/reference/components/group) components to organize more complex component configurations and use the Nav tab in the left sidebar to jump quickly between areas of the workspace.

Common design patterns are covered in the [tutorial](/guides/tutorials/intro).

### Connect your components to the database

If you want to display data from the database, you need to load it with special components such as [DataLoaderSingle](/reference/components/DataLoader). 

### Divide your app into different screens and set up navigation

Use [Route](/reference/components/Route) components to define different screens that the user can navigate to inside your app. To allow a user to navigate to a different route, use the effect property on interactice components like [Button](/reference/components/Button).

### Updating your app

Whenever you change something in the component structure, you need to press the `Save` button for changes to become effective in the app preview section.

The `Publish` button does the same, but makes the structural changes visible to visitors of your app. It also generates a link to test the app on your mobile device.

Important: Changes in the database do not need to be explicitly published, they update immediately.

