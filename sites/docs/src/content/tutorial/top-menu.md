## Top Menu

#### What the template does

The template creates a hierarchical menu that is accessible via a button on the home screen. This menu has different sections and a back button in the top bar.

#### Which parts of the system were used

The template was created entirely using components in the **App** section. You can navigate there by selecting the App tab at the top of the screen.

#### Techniques demonstrated

- The **TopBarShell** lets you divide the screen into a main content part and a bar at the top.

- The **HorizontalSpacer** allows you to divide the top bar into a central area and space for buttons on the left and right.

- The **Route** and **RouteConnector** components allow you to define parts of the app that are shown depening on the user. Each route has a unique path that we use to identify which route should be shown. "/" is always the starting path of the app.

- The **Button** component allows the user to interact with the app. In this case, we use the Button to select an active route and show the different parts of the app. We can add **Icon** components to buttons.

- The **QuickNav** section on below the list of components in the sidebar of the App section allows you to jump quickly to groups and routes.

#### Next Steps

- Change the icon of the button used for opening the menu.

- Change the order in which the sections appear in the menu.

- Add a new section by duplicating an existing RouteConnector, Route, and Button. You'll need to set a path for your route, and modify your new button to use that path. 

- Add content to the about and privacy sections, for example by loading rich text from a database sheet using a DataCell

