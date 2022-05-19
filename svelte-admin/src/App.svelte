<script>
  import "carbon-components-svelte/css/g10.css"; // all g10 g100 g90 white

  import Router, { querystring } from 'svelte-spa-router'
  import ProjectManager, { currentProjectName } from './ProjectManager.svelte'
  import { BundleServer } from './BundleServer'
  import Login from './Login.svelte';
  import SystemStatusBar from './SystemStatusBar.svelte';

  import { onMount } from 'svelte'

  import { 
    Header,
    Content,
    HeaderNav,
    HeaderNavMenu,
    HeaderNavItem
  } from "carbon-components-svelte";
  
  // see https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/README.md
  const routes = {
      '/:projectId?': ProjectManager,
  }

  import { InterkitClient } from 'interkit'
  onMount(async ()=>{
    await InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL);
    await BundleServer.connect(await InterkitClient.call("bundler.getUrl"))
  })

  let userId = InterkitClient.userId;

</script>

<Header 
  company="interkit" 
  platformName={$currentProjectName || "Redaktionssystem"} 
  href="/"
  >
  <!--HeaderNav>
    <HeaderNavItem text="Projekt" />
    <HeaderNavItem href="/" text="Link 2" />
    <HeaderNavItem href="/" text="Link 3" />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
  </HeaderNav-->
  <div class="status">
    {#if $userId}
      <SystemStatusBar />
    {/if}
  </div>
</Header>

<!-- set transform: none; to allow modal to be position fixed -->
<Content style="background: none; transform: none; padding: 0;">  

  {#if $userId}
    <Router {routes} />
  {:else}
    <Login/>
  {/if}

</Content>

<style>
  .status {
    flex: 1;
    padding: 1em;
    text-align: right;
  }
</style>