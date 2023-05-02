<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  export let name = "context"
  export let value = {}
  
  const valueStore = writable(value)
  setContext(name, valueStore);

  $: {
    //console.log("contextProvider got update", value)
    valueStore.set(value)
  }


</script>

<slot/>