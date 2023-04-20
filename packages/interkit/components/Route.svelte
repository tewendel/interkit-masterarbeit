<script>
  import { Route } from "svelte-navigator";

  export let path = "";
</script>

<Route {path}>
  <slot />
</Route>
