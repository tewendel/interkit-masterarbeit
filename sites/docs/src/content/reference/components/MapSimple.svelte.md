<script>
  import ComponentInfo from "../../../components/ComponentInfo.svelte";
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
  import src from "../../../../../../packages/interkit/components/MapSimple.svelte?raw";
</script>

# MapSimple

![A MapSimple example](/images/component_previews/MapSimple.png)

A map showing the users locationm, markers, and a popup that appears when you tap on them.

Data for multiple markers must be loaded using [DataLoaderMulti](/reference/components/DataLoader#dataloadermulti) (or if you only want to show only a single marker, through [DataLoaderSingle](/reference/components/DataLoader#dataloadersingle)).

See [MapViewButton](/reference/components/MapViewButton) for an interface that provides filters and layers.

<ComponentInfoYaml component="MapSimple" />

<br>
<details>
<summary>Developer docs</summary>

```docs
../../../../../../packages/interkit/components/MapSimple.svelte
```

</details>

<ComponentInfo code={src} />
