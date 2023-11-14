<script>

  import { page } from '$app/stores'
  import { getCurrentSection, getFirstDeepPath } from "../util/pathUtils.js"
  export let items

  $: currentSection = getCurrentSection($page.url.pathname)

  const forceSidebarDetailsOpen = path => {
    const details = document.querySelector(`details[data-path="${path}"]`)
    console.log('###', path, details)
    if (!details) return
    details.open = true
  }

</script>
  
{#each items as section}
  <li
    class:active={currentSection === section.path}
    >
      <!-- FIXME this href won't work in iframe; the 307-redirect (see routes/{guides,reference}/page.js) does not play nice with our "custom router" -->
    <a
      href={getFirstDeepPath(section)}
      on:click={forceSidebarDetailsOpen(section.path)}
      >{section.title}</a>  
  </li>
{/each}
