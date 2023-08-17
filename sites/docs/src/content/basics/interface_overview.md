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

## App

Three tabs in the main area:

- **blockly**: Build the interface of your app from components. Browse components in the left sidebar, click to expand, select and finally add. Drag and drop them in the main area; they will snap into slots. Each block has some properties/settings visible immediately; others can be edited by clicking the table icon on a block.
- **App.svelte** shows you the generated code. You don't need to and can't edit it.
- **actions.js** lets you implement advanced behaviors.

TODO Continue with the tutorial.

## Data

*Sheets* hold list (or tabular) data for your app, which you can reference in blockly components and in code.

When you have created a sheet, use the &vellip; menu of the table to add *columns*.
Each column has a *type*, e.g. *String* (for text), *image* or *location* (for maps).

After you have created some columns (and thus the structure of you app's data),
add *rows*, which hold the actual data. Each row represents one "entry" or "item".
Click the new row's cells to enter the data.
The column's type will determine how you enter it, e.g. an *image* can be selected from
the media you upload in the **Media** tab.

TODO Continue with the tutorial.

## Media

Under the *Project* tab you upload images, audio and video files for your app,
to reference them in blockly components, Sheets or in code.

You also manage and moderate *User generated* media that has been submitted by users of your app.

TODO Continue with the tutorial.

## Story

Build complex interactions that can be expressed by narrative flow concepts,
e.g. chat bots.

Create *boards* to organize story components,
e.g. if you have several chat bots, chat "channels", or chapters in an interactive story.
You don't need to necessarily have several board, but you need at least one to use the Story functionality. You activate and edit other boards by selecting them in the left sidebar.

At the top of the central area, you can edit your board's name and some metadata, like *Title* and *Label*.

Add *Nodes* to your board.
Expand your board in the left sidebar to see them in a list;
they will also appear in the central area, where you build your interaction graph.
Drag nodes to arrange them visually -- this has no meaning for interactions,
it just helps you design your graph.

Click a node to enter its code, which will appear in another pane.
Activate the Twine-ish tab, to enter code in **Twine-ish** mode.
Use the help button to see some example syntax.

TODO Continue with the tutorial.

## Troubleshooting

### Preview Iframe does not work

We rely on inter-frame communication.
Some script/ad blockers intercept this;
switch yours off or add an exception.
Also check the DevTools console for mentions of `window` and `iframe`.

