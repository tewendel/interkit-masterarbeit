<script>

  //import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { Components } from '../imports/collections.js';
  import { onMount } from 'svelte';

  // use mongo cursor as svelte store
  $: components = Components.find({});

</script>


<h1>hello from svelte on meteor</h1>

<ul>
<!-- we need to use $components here to get the reactive value of the store -->
{#each $components as component}
  <li>{component.title}</li>
{/each}
</ul>
