<script>
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";  
  import Figma from "../../../components/Figma.svelte";
</script>

# DataCard

![A DataCard example](/images/component_previews/DataCard.png)

A formatted card to display structured data, an image and buttons. See the embedded Figma for the available variants.

Data must be previously loaded for example with [DataLoaderMulti](/components/DataLoader) and [DataList](/components/DataList) or individually using [DataLoaderSingle](/components/DataLoader). 

We recommended wrapping layouts with Cards in [SectionShell](/components/SectionShell) for background color and spacing.

<ComponentInfoYaml component="DataCard" />

## Figma

<Figma url="https://www.figma.com/file/7y5c91AmKjRnfsnglX7yAD/Interkit-App-Interface?type=design&node-id=6557-17416&mode=design&t=u6n8efKF8M4gc5UV-4" />

<br><br>
<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/DataCard.svelte
```
</details>