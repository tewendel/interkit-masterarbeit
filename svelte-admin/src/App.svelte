<script>
  import "carbon-components-svelte/css/g10.css"; // all g10 g100 g90 white

  import Router from 'svelte-spa-router'
  import ProjectManager from './ProjectManager.svelte'

  import { onMount } from 'svelte'
  
  import { 
    Header,
    Content,
  } from "carbon-components-svelte";
  
  // see https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/README.md
  const routes = {
      '/:projectId?': ProjectManager,
  }

  import { InterkitClient } from 'interkit'
  onMount(async ()=>{
    await InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL);
  })

</script>

<Header company="interkit" platformName="Rekationssystem" href="/"></Header>

<!-- set transform: none; to allow modal to be position fixed -->
<Content style="background: none; padding: 1rem; transform: none;">

    <Router {routes} />

</Content>