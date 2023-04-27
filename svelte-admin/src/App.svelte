<script>
  import './base.scss'

  import Router, { querystring } from 'svelte-spa-router'
  import {link} from 'svelte-spa-router'

  import { BundleServer } from './BundleServer'
  import { InterkitClient } from 'interkit'

  import ProjectManager from './ProjectManager.svelte'
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
  import UserAdmin from "carbon-icons-svelte/lib/UserAdmin.svelte";

  import { projectId, currentProject } from './admin.js'

  let userIsRole = InterkitClient.userIsRole

  let tab = null;

  // see https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/README.md
  const routes = {
      '/:projectId?/:tab?': ProjectManager,
  }

  const routeLoaded = event => {
    //console.log("routeLoaded", event)
    $projectId = event.detail?.params?.projectId
    tab = event.detail?.params?.tab
  }

  onMount(async ()=>{
    await InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL);
    await BundleServer.connect(await InterkitClient.call("bundler.getUrl"))
  })

  $: connected = InterkitClient.connected;

  let userId = InterkitClient.userId;
  InterkitClient.initAuth()

  let isUserOpen = false;

  const logout = async () => {
    await InterkitClient.logout()
  }

  // get commit hash from current image tag
  const matches = INTERKIT_IMAGE_TAG.match(/([a-z0-9]{7})/)
  const commitHash = matches ? matches[0] : null
  
</script>

<Header 
  company="interkit" 
  platformName={$currentProject?.name || "Redaktionssystem"} 
  href="/#/"
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

  <TopTabs
    projectId={$projectId}
    showTabsLeft={!!$projectId}
    showTabsRight={true}
    {tab}
    />

  <HeaderUtilities>
    {#if $userId}
      <HeaderAction 
        bind:isUserOpen
        icon={UserAvatarFilledAlt}
        closeIcon={UserAvatarFilledAlt}
      >
        <HeaderPanelLinks>
          <HeaderPanelDivider>User {$userId}</HeaderPanelDivider>
          <div class="status">
            {#if $userIsRole?.admin}<UserAdmin />&ensp;has&nbsp;role&nbsp;<i>admin</i>{/if}
          </div>
          <HeaderPanelLink on:click={logout}>Logout</HeaderPanelLink>
          <HeaderPanelDivider>System Status</HeaderPanelDivider>
          <div class="status">
            {#if $userId}
              <SystemStatusBar currentProjectServerStatus={$currentProject?.projectServer?.status} />
            {/if}
          </div>  

          <HeaderPanelDivider>Redaktionssystem Version</HeaderPanelDivider>
          <div class="status">
            {INTERKIT_IMAGE_TAG}
            {#if commitHash}
              <a target="gitlab" href="https://gitlab.interkit.app/interkit/interkit-experiments/-/commits/{commitHash}/">
                What's new?
              </a>
            {/if}
          </div>
              
          
        </HeaderPanelLinks>
      </HeaderAction>
    {/if}
  </HeaderUtilities>
  
</Header>

{#if $userId}
  <Content style="padding:0;width:100%;height:var(--content-height);overflow:hidden;">

    <Router {routes} on:routeLoaded={routeLoaded} />

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
    padding: 0.5em 1em 0.5em 1em;
    text-align: left;
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

  /* BEGIN DataTable Hack */
  /* to avoid problems with filters that hide all rows */

  :global(.cell__1line) {
    white-space: nowrap;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }

  :global(.bx--data-table td > span) {
    display: block;
    max-width: 100%;
  }

  /* END DataTable Hack */

</style>
