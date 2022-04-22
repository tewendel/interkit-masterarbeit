<script>
  import Submenu from './Submenu.svelte'
  
  export let items;

</script>

{#each items as section}
  <Submenu 
    title={section.title}
    items={section.items} 
  />
{/each}

<hr />

<a href="https://interkit.app">
  Website
</a>

<br>

<a href="https://gitlab.interkit.app">
  Repository
</a>
