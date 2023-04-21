<script>
  import { setContext } from 'svelte';
  export let name = "context"
  export let value = {}
  setContext(name, value);
</script>

<slot/>