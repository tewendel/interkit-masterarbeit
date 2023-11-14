<script>

  import { page } from '$app/stores'
  import { getSection, getFirstDeepPath } from '../util/pathUtils.js';

  export let items

  let activeSection
  let activeSubsection
  let activeItem
  let currentPath

  $: {
    currentPath = $page.url.pathname
    activeSection = getSection(currentPath, items)    
    activeSection?.items?.forEach(s => {
      s.items.forEach(i => {
        if (i.path === currentPath) {
          activeSubsection = s
          activeItem = i
        }
      })
    })

  }

</script>

{activeSection?.title}<!-- remove whitespace, avoid gaps
--><span class="separator"><span class="sr-only">›</span></span><!--
-->{activeSubsection?.title}<!--
--><span class="separator"><span class="sr-only">›</span></span><!--
-->{activeItem?.title}

<style>

  span {
    display: inline-block;
  }

  .separator {
    width: 1.5em;
    background-repeat: no-repeat;
    background-size: 1em 1em;
    background-position: 0.35em center;
    background-image: url('/images/Breadcrumb.svg');
  }

</style>

