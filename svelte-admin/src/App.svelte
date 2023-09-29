<script>
  import './base.scss'

  import Router, { querystring } from 'svelte-spa-router'
  import {link} from 'svelte-spa-router'

  import { BundleServer } from './BundleServer'
  import { InterkitClient } from 'interkit'

  import ProjectManager from './Layout/ProjectManager.svelte'
  import Login from './User/Login.svelte';
  import SystemStatusBar from './Atoms/SystemStatusBar.svelte';
  import TopTabs from './Layout/TopTabs.svelte';
  import { Tag } from "carbon-components-svelte";

  import Exit from "carbon-icons-svelte/lib/Exit.svelte";
  
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

  import { 
    projectId, 
    currentProject, 
    currentUser, 
    currentProjectEditingUsers, 
    secondaryTabPreviewProjectId,
    currentProjectReadOnly,
    previewCurrentRoute
  } from './admin.js'

  let userIsRole = InterkitClient.userIsRole

  let tab = null;

  // see https://github.com/ItalyPaleAle/svelte-spa-router/blob/master/README.md
  const routes = {
    '/:mode?/:project?/:tab?': ProjectManager,  
  }
  // modes are 'template' oder 'project'
  // /template/hello-world    - use slug
  // /project/shjkdfsd87f6    - use id

  const routeLoading = async event => {
    console.log("routeLoading", event)

    // if we are on a template route, we expect a slug and find the projectId
    if(event.detail?.params?.mode == "template") {
      let slug = event.detail?.params?.project
      if(slug) {
        console.log("readonly route via slug", slug)
        if($currentProject?.slug != slug) {
          let projectIdFromSlug = await InterkitClient.call("project.getId", {slug})
          console.log("got projectId from slug", projectIdFromSlug)
          projectId.set(projectIdFromSlug)
          currentProjectReadOnly.set(true)
        }
      }
    } else {
      // otherwise use the projectId
      console.log("setting projectId store to", event.detail?.params?.project)
      projectId.set(event.detail?.params?.project)
      currentProjectReadOnly.set(false)
    }

    tab = event.detail?.params?.tab
    console.log("tab set to ", tab)

    //InterkitClient.call("user.trackActivity", { editingProjectId: $projectId, path: window.location.pathname + window.location.search + window.location.hash })

    // reset preview when leaving project
    if(event?.detail?.location == "/") {
      secondaryTabPreviewProjectId.set(null)
    }

  }

  onMount(async ()=>{
    await InterkitClient.connect(INTERKIT_SERVER_WEBSOCKETS_URL);
    await BundleServer.connect(await InterkitClient.call("bundler.getUrl"))
  })

  $: connected = InterkitClient.connected;

  let userId = InterkitClient.userId;
  InterkitClient.initAuth()
  InterkitClient.userEnableActivityTracking()

  let isUserOpen = false;

  const logout = async () => {
    await InterkitClient.logout()
  }

  // get commit hash from current image tag
  const matches = INTERKIT_IMAGE_TAG.match(/([a-z0-9]{7})/)
  const commitHash = matches ? matches[0] : null

  window.addEventListener('message', evt => {
    console.log('App received message')
    if (evt.data && evt.data.previewHistoryEvent) {
      previewCurrentRoute.set(evt.data.previewHistoryEvent?.location?.pathname || '(?)')
    }
  })

  
</script>


<Header 
  href="/#/"
  >

  <span slot="company">
    {#if $currentProject}
      <span class="exit-arrow"><Exit /></span>
      <span class="project-name">{$currentProject?.name}</span>
      {#if $currentProjectReadOnly}<Tag type="red">readonly</Tag>{/if}
    {:else}
      interkit
    {/if}
  </span>
  
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

  {#if $userId}
    <TopTabs
      projectId={$projectId}
      showTabsLeft={!!$projectId}
      showTabsRight={true}
      {tab}
      />
  {/if}

  <HeaderUtilities>
    {#if $userId}
      <HeaderAction 
        bind:isUserOpen
        icon={UserAvatarFilledAlt}
        closeIcon={UserAvatarFilledAlt}
      >
        <HeaderPanelLinks>
          <HeaderPanelDivider>User {$currentUser?.username}</HeaderPanelDivider>
          <div class="status">
            {#if $userIsRole?.admin}<UserAdmin />&ensp;has&nbsp;role&nbsp;<i>admin</i>{/if}
          </div>
          <HeaderPanelLink on:click={logout}>Logout</HeaderPanelLink>

          {#if $currentProjectEditingUsers}
            <HeaderPanelDivider>Other Users (now active)</HeaderPanelDivider>
            <div class="status">
              {#each $currentProjectEditingUsers as user}
                {#if user.id != $currentUser.id}
                  <div>
                    {user.username}
                  </div>
                {/if}
              {/each}
            </div>  
          {/if}

          <HeaderPanelDivider>System Status</HeaderPanelDivider>
          <div class="status">
            {#if $userId}
              <SystemStatusBar />
            {/if}
          </div>  

          <HeaderPanelDivider>Authoring System Version</HeaderPanelDivider>
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

    <Router {routes} on:routeLoading={routeLoading} />

  </Content>
{:else}
  <div class="centered">
    <h1 style="padding-bottom: 1em; text-align: center;">
      Welcome to interkit
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
  @use '@carbon/type';

  .exit-arrow {
    position: relative;
    top: 2px;
    margin-right: 3px;
  }
  .project-name {
    @include type.type-style("heading-compact-02")
  }

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

  /* Hack to avoid active blockly input etc. hovering above other tabs.
   * The two classes are toggled in App/BlocklyEditor and Layout/TopTabs. */
  :global(body:not(.appTabActive.appBlocklyTabActive) .blocklyWidgetDiv[style]),
  :global(body:not(.appTabActive.appBlocklyTabActive) .blocklyDropDownDiv[style]),
  :global(body:not(.appTabActive.appBlocklyTabActive) .blocklyTooltipDiv[style]) {
    display: none !important;
  }

</style>
