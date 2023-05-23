<script>

  import { Route } from "svelte-navigator";
  import BoardLoader from "./Chat/BoardLoader.svelte"
  
  export let path;
  let dynamicPath = path + "/:boardId"

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
    <BoardLoader boardId={params.boardId}>
      <slot></slot>
    </BoardLoader>    
  </Route>
{/if}