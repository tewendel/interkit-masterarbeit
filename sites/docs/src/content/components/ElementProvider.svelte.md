<script>
  import ComponentInfo from "../../components/ComponentInfo.svelte";
  import src from "../../../../../packages/interkit/components/ElementProvider.svelte?raw";
</script>

# ElementProvider

## basic idea

gets the contents of specified global store and provides them 
* as slot prop "element" to consumer (for example for ContentElement)
* additionally in ElementProvider context as `{element: store}`

Special: in ChatPreview and DynamicContent you can use the syntax $ElementProvider.columnKey in a blockly prop to reference a column of the element provided through ElementProvider


```docs
../../../../../packages/interkit/components/ElementProvider.svelte
```

<ComponentInfo code={src} />
