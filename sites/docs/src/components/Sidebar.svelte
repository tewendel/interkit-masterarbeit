<script>
  import Submenu from './Submenu.svelte'
  import { page } from '$app/stores';
  import { getSectionItems } from '../util/pathUtils'
  
  export let items;
  console.log("Sidebar got items", items)

  let sectionItems
  $: currentPath = $page.url.pathname
  $: sectionItems = getSectionItems(currentPath, items)
  
</script>

{#if sectionItems}
  {#each sectionItems as subSection}
    <Submenu 
      title={subSection.title}
      path={subSection.path}
      items={subSection.items} 
      open={subSection.open}
    />
  {/each}
{/if}

<hr />

<a href="https://interkit.app" target="_blank">
  Website
</a>

<br>

<a href="https://gitlab.interkit.app" target="_blank">
  Repository
</a>
