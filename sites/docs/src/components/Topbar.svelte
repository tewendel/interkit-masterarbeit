<script>
  import { page } from '$app/stores';
  import { getCurrentSection } from "../util/pathUtils.js";
  export let items;

  $: currentSection = getCurrentSection($page.url.pathname)

</script>
  
<ul>
  {#each items as section}
    <li>
      {#if currentSection != section.path}
        <a href={section.path}>{section.title}</a>  
      {:else}
        <b>{section.title}</b>
      {/if}
    </li>
  {/each}
</ul>

<style>
  ul {
    padding: 0;
  }
  li {
    display: inline;
  }



</style>
  
  