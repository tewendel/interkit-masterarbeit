<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
</script>

# ARViewer

A viewer component for AR media, using the native AR players on iOS and Android.

For devices that don't support AR, a video fallback can be provided.

Data is provided through an element context, for example using [DataLoaderSingle](/reference/components/DataLoader).

The viewer is a full screen overlay and should be displayed inside its own route. The close button invokes the "back" route (see [Routing](/reference/components/Route)).

<ComponentInfoYaml component="ARViewer" />

<br>
<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/ARViewer.svelte
```

</details>

