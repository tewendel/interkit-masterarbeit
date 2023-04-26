<script>
  import { Route, useMatch } from "svelte-navigator";
  
  export let path = "";
  export let keepAlive;
  console.log("keepAlive", path, keepAlive)

  let match; 
  try {
    match = useMatch(path);
  } catch(e) {
    console.log(e)
  }
  
</script>

{#if match}

  <Route {path}>
    {#if !keepAlive}
      <slot />
    {/if}
  </Route>

  {#if keepAlive}
    <div class="container" class:hide={!$match}>
      <slot />
    </div>
  {/if}

{/if}

<style>
  .container {
    height: 100%;
  }
  .hide {
    visibility: hidden;
    position: absolute;
    width: 100%;
  }
</style>