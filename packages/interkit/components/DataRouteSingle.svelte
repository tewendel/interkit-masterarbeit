<script>

  import { Route } from "svelte-navigator";
  import DataLoaderSingle from "./DataLoaderSingle.svelte"
  
  export let path;
  let dynamicPath = path + "/:key"

  export let sheet;

  // try to get navigate hook, this only works when component is inside of a router
  import { useNavigate } from "svelte-navigator";
  let navigate;
  try {
    navigate = useNavigate();
  } catch(e) {
    console.log(e)
  }
  
</script>

{#if navigate}
  <Route path={dynamicPath} let:params>
    <DataLoaderSingle sheetKey={sheet} rowKey={params.key}>
      <slot/>
    </DataLoaderSingle>
  </Route>
{/if}