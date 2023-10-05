<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
  import Figma from "../../../components/Figma.svelte";
</script>

# Icon

![A Icon example](/images/component_previews/Icon.png)

Use the Icon component to select one of the built in icons. The embedded Figma file below shows how the icons are called.

<ComponentInfoYaml component="Icon" />

#### Figma

<Figma url="https://www.figma.com/file/7y5c91AmKjRnfsnglX7yAD/Interkit-App-Interface?type=design&node-id=7356-7381&mode=design" />

#### Advanced

If the Icon is used inside a Button component that specifies a 'path' clickType, it automatically shows the 'Full' icon variant if the path is the active route. This is useful when building a bottom menu to show the highlighted buttons.
