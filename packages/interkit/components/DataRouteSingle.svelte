<script>

  import { Route } from "svelte-navigator";
  import DataLoaderSingle from "./DataLoaderSingle.svelte"
  
  export let path;
  let dynamicPath = path + "/:key"
  
</script>

<Route path={dynamicPath} let:params>
  <DataLoaderSingle sheetKey={path} rowKey={params.key}>
    <slot/>
  </DataLoaderSingle>
</Route>
