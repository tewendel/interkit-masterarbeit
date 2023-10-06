<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
</script>

# MapViewButton

![A MapViewButton example](/images/component_previews/MapViewButton.png)

An interface to allow for the selction of MapViews on a [MapSimple](/reference/components/MapSimple), allowing the user to filter markers and change the map style.

MapViews are managed via a separate database sheet that you can set up using dialogs in the settings of this component.

There are three different types of map views.
* Filter: You can select multiple filters at once.
* Layer: You can only select one layer at a time. When a layer is selected, the map style can change.
* Layer+Filter: When selected, the map style changes and markers are filtered.

To assign a marker to a specific MapView, create a reference column on the sheet containing your markers (markerCategoryColumn). Then select one or multiple MapViews for each location.

MapViews with the Layer+Filter type are shown together with the layers.

<ComponentInfoYaml component="MapViewButton" />

<br>
<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/MapViewButton.svelte
```

</details>

