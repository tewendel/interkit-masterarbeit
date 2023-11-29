# The interkit Authoring System interface

## The top bar and right sidebar

- On the top left, when managing and creating projects, it says *interkit Authoring System*.  
  Later, it tells you which project you are editing.
- On the far right, the user icon activates the user sidebar.
  It lets you log out, shows you information about your user and the project.
- On the right, you can control the right pane. Switch between
    - **Preview** – an interactive simulation/view of your app.
    - **Docs** – you can read the documentation while working on your app.
    - **Logs** – shows you what the project server is doing.
- When you're editing a project, on the left, you can switch between the main tabs, described below.

## Project

The Project tab contains administative information and settings about your project. In the sidebar, there are several sections:
- **Start** - show a welcome message, that you can customize by editing the file `src/project.md``
- **Users** - show a list of users 
- **Messages** - manage chat messages
- **Schedule** - track scheduled messages that will be sent later
- **Repository** - manage and edit the files in your project
- **Settings** - general settings and import/export of media

## App

Three tabs in the main area:

- **blockly**: Build the interface of your app from components. Browse components in the left sidebar, click to expand, select and finally add. Drag and drop them in the main area; they will snap into slots. Each block has some properties/settings visible immediately; others can be edited by clicking the table icon on a block.
- **App.svelte** shows you the generated code. You don't need to and can't edit it.
- **actions.js** lets you implement advanced behaviors.

See [Building an App with Components](/guides/quick-start/components)

## Data

*Sheets* hold list (or tabular) data for your app, which you can reference in blockly components and in code.

When you have created a sheet, use the &vellip; menu of the table to add *columns*.
Each column has a *type*, e.g. *String* (for text), *image* or *location* (for maps).

After you have created some columns (and thus the structure of you app's data),
add *rows*, which hold the actual data. Each row represents one "entry" or "item".
Click the new row's cells to enter the data.
The column's type will determine how you enter it, e.g. an *image* can be selected from
the media you upload in the **Media** tab.

See [Working with Data](/guides/quick-start/data)

## Media

Under the *Project* tab you upload images, audio and video files for your app,
to reference them in blockly components, Sheets or in code.

You also manage and moderate *User generated* media that has been submitted by users of your app.

## Story

Build complex interactions that can be expressed by narrative flow concepts, e.g. chat bots.

See [Getting started with Chatbots](/guides/quick-start/chat)


