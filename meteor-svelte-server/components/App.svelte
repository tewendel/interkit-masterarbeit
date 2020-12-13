<script>

  import { useTracker } from 'meteor/rdb:svelte-meteor-data';
  import { Components } from '../imports/collections.js';
  import { onMount } from 'svelte';

  $: components = useTracker(() => Components.find({}).fetch());

</script>


<h1>hello from svelte on meteor</h1>

<ul>
{#each $components as component}
  <li>{component.title}</li>
{/each}
</ul>
