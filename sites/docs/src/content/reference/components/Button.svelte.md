<script>
  import ComponentInfo from "../../../components/ComponentInfo.svelte";
  import ComponentInfoYaml from "../../../components/ComponentInfoYaml.svelte";
  import src from "../../../../../../packages/interkit/components/Button.svelte?raw";
  import Button from "../../../../../../packages/interkit/components/Button.svelte";
  import Styling from "../../../../../../packages/interkit/components/Styling.svelte";
  import Figma from "../../../components/Figma.svelte";
</script>

# Button

![A Button example](/images/component_previews/Button.png)

Basic button to allow user input. 

Your app can respond to a button press in several different ways by setting it's effect, for example activating a specific [Route](/components/Route). 

<ComponentInfoYaml component="Button" />

## Live Examples

### Large Button

<Styling>
  <Button type="primary" size="large">
    Large Primary Button
  </Button>

  <Button type="secondary" size="large">
    Large Secondary Button
  </Button>

  <Button type="ghost" size="large">
    Large Ghost Button
  </Button>

  <Button type="link" size="large">
    Large Link Button
  </Button>
</Styling>

### Medium Button

<Styling>
  <Button type="primary" size="medium">
    Medium Primary Button
  </Button>

  <Button type="secondary" size="medium">
    Medium Secondary Button
  </Button>

  <Button type="ghost" size="medium">
    Medium Ghost Button
  </Button>

  <Button type="link" size="medium">
    Medium Link Button
  </Button>
</Styling>

### Small Button

<Styling>
  <Button type="primary" size="small">
    Small Primary Button
  </Button>

  <Button type="secondary" size="small">
    Small Secondary Button
  </Button>

  <Button type="ghost" size="small">
    Small Ghost Button
  </Button>

  <Button type="link" size="small">
    Small Link Button
  </Button>
</Styling>


## Figma

<Figma url="https://www.figma.com/file/7y5c91AmKjRnfsnglX7yAD/Interkit-App-Interface?node-id=3240%3A21589" />

<details>
<summary>Developer docs</summary>

```docs
../../../../../packages/interkit/components/Button.svelte
```
</details>

## ButtonBar

![A Button example](/images/component_previews/ButtonBar.png)

Use the ButtonBar to organize [Buttons](/components/Button) horizontically, for example by centering a button or allowing buttons to fill the full width of the bar. You can also add a help text below the bar.

<ComponentInfoYaml component="ButtonBar" />