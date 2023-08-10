## Bottom Menu

#### What the template does

The template creates a menu with three buttons at the bottom of the screen. Tapping the buttons opens different sections of the app, showing different content.

#### Which parts of the system were used

The template was created entirely using components in the **App** section. You can navigate there by selecting the App tab at the top of the screen.

#### Techniques demonstrated

- The **BottomBarShell** lets you divide the screen into a main content part and a bar at the bottom.

- The **Route** and **RouteConnector** components allow you to define parts of the app that are shown depening on the user. Each route has a unique path that we use to identify which route should be shown. 

- **NavBar** and **NavButton** components allow you to build a horizontal menu. We configure each **NavButton** to select an active route and show the different parts of the app. We can add **Icon** components to buttons.

- The **Group** and **GroupConnector** components allow you to structue you component composition to keep an overview.

- The **QuickNav** section on below the list of components in the sidebar of the App section allows you to jump quickly to groups and routes.

#### Next Steps

- Change the content of the different screens.

- Change the order of buttons in the bottom bar.

- Change the text and icon of a button.

- Change which button opens which route by modifying the clickTrigger setting of a button to refer to a different route.

- Add a new route and a corresponding button.