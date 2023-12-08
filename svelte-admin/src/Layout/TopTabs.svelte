<script>

  import { Tabs, Tab, Dropdown, Loading } from "carbon-components-svelte";
  import {push, pop, replace} from 'svelte-spa-router'
  import NotificationBadge from "../Atoms/NotificationBadge.svelte";
  import ReportsNotificationBadge from "../Messages/ReportsNotificationBadge.svelte";
  import RepositoryNotificationBadge from "../Project/RepositoryNotificationBadge.svelte";
  import PlaygroundNotice from "../Atoms/PlaygroundNotice.svelte";
  import TopTabLabel from "./TopTabLabel.svelte";
  import { navigateTab } from "./ProjectWorkspace.svelte"
  import { compileError, runtimeError, bundleProcessing } from '../BundleServer.js'

  import { 
    secondaryTabIndex, 
    secondaryTabsHidden,
    currentProjectReadOnly,
    currentProject,
    projectTabPath
  } from "../admin.js"
  
  export let projectId;
  export let tab; // this is a string of the active path
  export let showTabsLeft;
  export let showTabsRight;

  let mainSelected; // this is a numeric index
  let selectedDropdownId = "more"; // this is a string

  /* Hack to avoid active blockly input etc. hovering above other tabs.
   * See root App.svelte style and App/BlocklyEditor */
  $: document.body.classList.toggle('appTabActive', (mainSelected === 1) || (tab === 'components'))

  // main tabs
  const mainTabPaths = [
    '',
    'app', 
    'data', 
    'media', 
    'story', 
    'style'
  ];
  // dropdown items
  const dropdownPaths = [
  ];
  // subtabs in the project tab
  const startPaths = [
    'project',
    'users',
    'messages',
    'schedule',
    'repository',
  ];

  const updateTabFromPropChange = (newTab) => {
    if(!newTab) {
      mainSelected = 0
      selectedDropdownId = "more"
    }
    if(mainTabPaths.includes(newTab)) {
      mainSelected = mainTabPaths.indexOf(newTab);
      selectedDropdownId = "more"
    }
    if(dropdownPaths.includes(newTab)) {
      selectedDropdownId = newTab;
      mainSelected = 0;
    }
    if(startPaths.includes(newTab)) {
      selectedDropdownId = "more";
      mainSelected = 0;
    }
    console.log("tab changed from prop to:", newTab, mainSelected)
  }

  $: updateTabFromPropChange(tab)
  
  const changeSecondaryTab = (e) => {
    //console.log("secondary Tab changed to ", e.detail)
    secondaryTabIndex.set(e.detail)
  }

  const navigate = (path) => {
    let targetPath = path
    if (path === '') {
      targetPath = $projectTabPath
    }
    navigateTab(targetPath)
  }

</script>

{#if showTabsLeft}
  <div class="tabs-left">

    <div class="tabs-main">
      <!--a use:link href="/components" >Appa</a>
      <a use:link href="/sheets" >Daten</a-->
      <Tabs autoWidth bind:selected={mainSelected}>

        <!-- we are using on:click here and below because we also have the tabs bound to a prop and don't want the event to fire when that changes -->
        <Tab on:click={e => navigate(mainTabPaths[0])}>
          Project
        </Tab>

        <Tab on:click={e => navigate(mainTabPaths[1])}>
          <TopTabLabel path={mainTabPaths[1]} {tab}>
            App 
            <NotificationBadge count={0} />
          </TopTabLabel>
        </Tab>

        <Tab on:click={e => navigate(mainTabPaths[2])}>
          <TopTabLabel path={mainTabPaths[2]} {tab}>
            Data
          </TopTabLabel>
        </Tab>

        <Tab on:click={e => navigate(mainTabPaths[3])}>
          <TopTabLabel path={mainTabPaths[3]} {tab}>
            Media
          </TopTabLabel>
        </Tab>

        <Tab on:click={e => navigate(mainTabPaths[4])}>
          <TopTabLabel path={mainTabPaths[4]} {tab}>
            Story
          </TopTabLabel>
        </Tab>

        <Tab on:click={e => navigate(mainTabPaths[5])}>
          <TopTabLabel path={mainTabPaths[5]} {tab}>
            Design
          </TopTabLabel>
        </Tab>

        <!-- disabled tab for when dropdown is active -->
        <!--Tab label="" disabled /-->
        
      </Tabs>
      
    </div>

    {#if dropdownPaths.length > 0}
      <div class="extra-dropdown">
        <Dropdown
          light
          type = "inline"
          bind:selectedId={selectedDropdownId}
          on:select={ e => navigate(e.detail.selectedId) }
          let:item
          items={[
            { id: "more", text: "more", disabled: true },
            { id: "project", text: "Project" },
            { id: "users", text: "Users" },
            { id: "messages", text: "Messages" },
            { id: "schedule", text: "Schedule" },
            { id: "repository", text: "Repository" },
            { id: "style", text: "Design"}
          ]}
        >
          {item.text}
          {#if item.id == "messages" }
            <ReportsNotificationBadge {projectId} />
          {/if}
          {#if item.id == "repository" }
            <RepositoryNotificationBadge  />
          {/if}
        </Dropdown>

      </div>
    {/if}
    
    <PlaygroundNotice />

  </div>
{:else}
  <div style="flex: 1; width: 100%"><!--spacer--></div>
  <PlaygroundNotice />
{/if}

{#if showTabsRight}
  <div class="tabs-preview" class:visible={!$secondaryTabsHidden}>

    <Tabs
      autoWidth
      selected={$secondaryTabIndex}
      on:change={changeSecondaryTab}
      >
      <!-- separator -->
      <span class="tab-separator"><span/></span>
    
      <Tab style="position: relative">
        Preview
        <NotificationBadge
          count={0}
          loading={$bundleProcessing}
          posAbs={true}
          />
      </Tab>
      <Tab>
        Docs
        <NotificationBadge count={0} />
      </Tab>
      <Tab disabled={!projectId}>
        Logs
        <NotificationBadge count={0} />
      </Tab>
    </Tabs>

  </div>
{/if}

<style lang="scss">

  @use '@carbon/styles/scss/theme';
  @use '@carbon/type';

  .tabs-left {
    flex:1;
    width: 100%;
    color: white;
    display: flex;
    place-content: center;
  }
  .tabs-main {
    width: 440px;
  }
  .extra-dropdown {
    width: 100px;
    height: 100%;
  }

  .tab-separator {
    display:flex;
  }

  .tab-separator span {
    border-left: solid 1px #eee; 
    width: 10px;
    margin-top: 10px;
  }

  .tabs-preview {
    width: calc(33.3333333vw - 48px);
    height: 100%;
    visibility: hidden;
    display: flex;
    align-items: end;
  }

  .tabs-preview.visible {
    visibility: visible;
  }

  :global(.bx--list-box__menu #more) {
    display: none
  }

  small {
    @include type.type-style('helper-text-01');
  }
  
</style>
