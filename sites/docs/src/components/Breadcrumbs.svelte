<script>

  import { page } from '$app/stores'
  import { getSection } from '../util/pathUtils.js';

  export let items

  let activeSection
  let activeSubsection
  let activeItem
  let currentPath

  $: {
    currentPath = $page.url.pathname
    activeSection = getSection(currentPath, items)    
    activeSection.items.forEach(s => {
      s.items.forEach(i => {
        if (i.path === currentPath) {
          activeSubsection = s
          activeItem = i
        }
      })
    })

  }

</script>

{activeSection.title}
› 
<!--<a href={activeSubItem.path}>-->
{activeSubsection?.title}
<!--</a>-->
›
{activeItem?.title}