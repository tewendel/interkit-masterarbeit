<script>

  import { page } from '$app/stores'

  export let items

  let activeSection
  let activeSubItem
  let currentPath

  $: {
    currentPath = $page.url.pathname
    items.forEach(s => {
      s.items.forEach(i => {
        if (i.path === currentPath) {
          activeSection = s
          activeSubItem = i
        }
      })
    })
  }

</script>

{#if currentPath !== '/'}
  <a href="/">Home</a>
{:else}
  Home
{/if}
›
{activeSection?.title}
› 
<!--<a href={activeSubItem.path}>-->
{activeSubItem?.title}
<!--</a>-->
