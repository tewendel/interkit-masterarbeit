<script>
  import ComponentInfo from "../../components/ComponentInfo.svelte";
  import src from "../../../../../packages/interkit/components/ElementProvider.svelte?raw";
</script>

# ElementProvider

## basic idea

gets the contents of specified global store and provides them 
* as slot prop "element" to consumer (for example for ContentElement)
* additionally in ElementProvider context as {element: store}


```docs
../../packages/interkit/components/ElementProvider.svelte
```

<ComponentInfo code={src} />
