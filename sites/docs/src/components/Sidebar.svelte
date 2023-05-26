<script>
  import Submenu from './Submenu.svelte'
  
  export let items;

</script>

{#each items as section}
  <Submenu 
    title={section.title}
    path={section.path}
    items={section.items} 
    open={section.open}
  />
{/each}

<hr />

<a href="https://interkit.app" target="_blank">
  Website
</a>

<br>

<a href="https://gitlab.interkit.app" target="_blank">
  Repository
</a>
