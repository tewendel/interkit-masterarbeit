<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
</script>

# Routing

Interkit offers several components to define the routing behaviour of your app.

Routing is the technical term for managing the different screens that are shown while the user interacts with an app.

At any point in time, each user is on a specific route.

The default Route shown on startup is called "/". When the user navigates to a page, it might change to something like "/about".

## Route

![A Route example](/images/component_previews/Route.png)

Basic routes are defined using the Route component and connected using the [RouteConnector](#routeconnector) component (see below).

<ComponentInfoYaml component="Route" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/Route.svelte
```

</details>

## RouteConnector

![A RouteConnector example](/images/component_previews/RouteConnector.png)

Every Route must be connected to your app using RouteConnector. Usually, this is placed directly inside AppBase. 

RouteConnector determines where in the component hierarchy the contents of your route are rendered when the route is activated.

You can activate routes using [Button effects](/reference/components/Button).

<ComponentInfoYaml component="RouteConnector" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/RouteConnector.svelte
```

</details>

## DataRouteSingle

DataRouteSingle defines a special route, where a specific row from the database is loaded and made available to the child components.

Use DataRouteSingle when you want to open a detail view for a specific element from the database that the user selected, for example from a [DataList](/reference/components/DataList).

DataRouteSingle is often called via a [Button](/reference/components/Button) effect. The Button then automatically passes the row key to DataRouteSingle, which uses that information to load the element.

When you set "elements" as the path, DataRouteSingle makes individual element routes available in the form of "/elements/16502d07-97ec-4b67-8283-ad5a7f44cd2c"

<ComponentInfoYaml component="DataRouteSingle" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/DataRouteSingle.svelte
```

</details>

## DataRouteMulti

DataRouteMulti is a special Route with a built-in [DataLoaderMulti](/reference/components/DataLoader#dataloadermulti). It is equivalent to using Route and DataLoaderMulti together manually.

<ComponentInfoYaml component="DataRouteMulti" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/DataRouteMulti.svelte
```

</details>

## ChatRoute

ChatRoute is a special Route that loads a specific StoryBoard. Use ChatRoute to contain your [Chat](/reference/components/Chat) component when you are working with multiple storyboards, for example with a [StoryBoardsList](/reference/components/StoryBoard#storyboardslist)

<ComponentInfoYaml component="ChatRoute" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/ChatRoute.svelte
```

</details>
