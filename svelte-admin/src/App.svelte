<script>
  import "carbon-components-svelte/css/g10.css"; // all g10 g100 g90 white

  import Router, { querystring } from 'svelte-spa-router'
  import ProjectManager, { currentProjectName, currentProjectServerStatus } from './ProjectManager.svelte'
  import { BundleServer } from './BundleServer'
  import Login from './Login.svelte';
  import SystemStatusBar from './SystemStatusBar.svelte';

  import { onMount } from 'svelte'

  import { 
    Header,
    Content,
    HeaderNav,
    HeaderNavMenu,
    HeaderNavItem,
    InlineLoading,
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

  $: connected = InterkitClient.connected;

  let userId = InterkitClient.userId;

</script>

{#if $userId}
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
        <SystemStatusBar currentProjectServerStatus={$currentProjectServerStatus} />
      {/if}
    </div>
  </Header>

  <!-- set transform: none; to allow modal to be position fixed -->
  <Content style="padding:0;">  

    <Router {routes} />

  </Content>
{:else}
  <div class="centered">
    <h1 style="padding-bottom: 1em; text-align: center;">
      Welcome to Interkit
    </h1>
    {#if $connected}
      <Login/>
    {:else}
      <InlineLoading style="width: auto" description="Connecting to {INTERKIT_SERVER_WEBSOCKETS_URL}" />
    {/if}
  </div>
{/if}

<style>
  .status {
    flex: 1;
    padding: 1em;
    text-align: right;
  }
  .centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }
</style>