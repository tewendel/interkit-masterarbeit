<script>
  import './base.scss'

  import Router, { querystring } from 'svelte-spa-router'
  import ProjectManager, { currentProjectName, currentProjectServerStatus } from './ProjectManager.svelte'
  import { BundleServer } from './BundleServer'
  import Login from './Login.svelte';
  import SystemStatusBar from './SystemStatusBar.svelte';
  import TopTabs from './TopTabs.svelte';

  import { onMount } from 'svelte'

  import { 
    Header,
    Content,
    HeaderNav,
    HeaderNavMenu,
    HeaderNavItem,
    HeaderUtilities,
    HeaderAction,
    InlineLoading,
    SideNav,
    SideNavMenu,
    SideNavMenuItem,
    SideNavItems,
    SideNavLink,
    HeaderPanelLinks,
    HeaderPanelLink,
    HeaderPanelDivider,
  } from "carbon-components-svelte";
  
  import UserAvatarFilledAlt from "carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte";


  // see https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/README.md
  const routes = {
      '/:projectId?': ProjectManager,
      '/:projectId?/*': ProjectManager,
  }

  import { InterkitClient } from 'interkit'

  onMount(async ()=>{
    await InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL);
    await BundleServer.connect(await InterkitClient.call("bundler.getUrl"))
  })

  $: connected = InterkitClient.connected;

  let userId = InterkitClient.userId;
  InterkitClient.initAuth()

  let isUserOpen = false;

</script>


<Header 
  company="interkit" 
  platformName={$currentProjectName || "Redaktionssystem"} 
  href="/"
  >
  
  <!--HeaderNav>
    <HeaderNavItem text="Projekt" />
    <HeaderNavItem href="#/n7Q2Yb9R27zeE7ecR" text="Link 2" />
    <HeaderNavItem href="/" text="Link 3" />
    <HeaderNavMenu text="Menu">
      <HeaderNavItem href="/" text="Link 1" />
      <HeaderNavItem href="/" text="Link 2" />
      <HeaderNavItem href="/" text="Link 3" />
    </HeaderNavMenu>
  </HeaderNav-->

  <TopTabs />
  
  <div class="status">
    {#if $userId}
      <SystemStatusBar currentProjectServerStatus={$currentProjectServerStatus} />
    {/if}
  </div>

  <HeaderUtilities>
    <HeaderAction 
      bind:isUserOpen
      icon={UserAvatarFilledAlt}
      closeIcon={UserAvatarFilledAlt}
    >
      <HeaderPanelLinks>
        <HeaderPanelDivider>user {$userId}</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 3</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 4</HeaderPanelLink>
        <HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
        <HeaderPanelLink>Switcher item 2</HeaderPanelLink>
        <HeaderPanelDivider>Switcher subject 3</HeaderPanelDivider>
        <HeaderPanelLink>Switcher item 1</HeaderPanelLink>
      </HeaderPanelLinks>
    </HeaderAction>
  </HeaderUtilities>
  
</Header>


{#if $userId}
  <!-- set transform: none; to allow modal to be position fixed -->
  <Content style="padding:0;width:100%;transform:scale(1)">  

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

<style lang="scss">

  @use '@carbon/styles/scss/theme';

  .status {
    
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

  /* BEGIN Hack to make Carbon UIShell white */

  :global(.bx--header),
  :global(.bx--header__name),
  :global(.bx--header__action > svg) {
    background-color: theme.$background;
    color: theme.$text-primary !important;
    fill: theme.$text-primary;
  }
  :global(.bx--header .bx--tabs__nav-link) {
    border-color: theme.$background;
  }

  /* END Hack to make Carbon UIShell white */

  /* BEGIN Hack to place stuff in Header */
  
  :global(.bx--header__global) {
    flex: 0;
  }
  /* END Hack to place stuff in Header */

</style>
