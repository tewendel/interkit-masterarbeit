<script>
  import { Router, createHistory, createMemorySource } from "svelte-navigator";

  const memoryHistory = createHistory(createMemorySource());
</script>

<Router history="{memoryHistory}">
  <slot />
</Router>