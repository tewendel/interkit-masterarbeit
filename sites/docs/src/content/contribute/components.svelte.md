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

## Documentation

- add a doc entry at `content/components/ComponentName.md`
- add a preview image (shown in the component picker inside the authoring system) to the docs repository at `static/images/component_previews/ComponentName.png`

## Dummy Data

For components that use data from sheets, it is useful to define some dummy data to make it easier to see how the component looks even without data. In the preview pane you can toggle Dummy Data on and off.

In your component code, use `const showDummyData = InterkitClient.showDummyData;` to get a reactive store containing the value of this toggle.

## Example

You can find this example for a custom project component in `src/components/ProjectComponentExample.svelte`

### ProjectComponentExample.svelte
<ComponentInfo noheader code={example_svelte} />

### ProjectComponentExample.yaml
<ComponentInfo noheader code={example_yaml} />

### Resulting ProjectComponentExample in component editor

![example](/images/ProjectComponentExample.png)

## List of supported attributes in `.yaml`

- `name` name of the file
- `title` title for the editor
- `colour` a number, see [Blockly colour picker](https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#block_colours)
- `toolboxCategory` category for the editor
- `slotCategory` (optional) name that corresponds to allowedChildren (it will only fit when mentioned there)
- `fields` (optional) array of fields
  - `name` name of the field
  - `defaultValue` (optional) default value for the field
  - `type` type of the field (type see below)
- `docsPath` (optional) a path to the documentation for this block, if not set, will use the name of the component

### field types

- `string`
- `number`
- `checkbox`
- `options`
- `sheetColumn`
- `slot`

### additional attributes for field type: options

- `options`

### additional attributes for field type: slot

- `slotProps`
- `allowedChildren`

### additional attributes for field type: sheetColumn

- `columnType`

 