<script>
  import ComponentInfo from "../../components/ComponentInfo.svelte";
  import example_svelte from "../../../../../repositories/starters/starter/src/components/ProjectComponentExample.svelte?raw";
  import example_yaml from "../../../../../repositories/starters/starter/src/components/ProjectComponentExample.yaml?raw";
</script>

# Components

## Scope

There are  ...

- Included interkit components that come with interkit
- Project components that you can custom build for your project

## Blockly

Components are arranged via Blockly. The `blocklyState.xml` gets translated into an `App.svelte`. Both files are equivalent to the blockly representation you see in the component editor.

## Component Files

Eeach component consists of two files:

- `ComponentName.svelte` - a svelte component
- `ComponentName.yaml` - definitions for the component editor

## Example

You can find this example for a custom project component in `src/components/ProjectComponentExample.svelte`

### ProjectComponentExample.svelte
<ComponentInfo noheader code={example_svelte} />

### ProjectComponentExample.yaml
<ComponentInfo noheader code={example_yaml} />

### Resulting ProjectComponentExample in component editor

![example](/images/ProjectComponentExample.png)

## List of supported attributes in `.yaml`

- type
  - slot
  - options
  - string
  - ...
- ...