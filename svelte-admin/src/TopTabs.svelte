<script>
  import { Tabs, Tab, Dropdown } from "carbon-components-svelte";
  import {push, pop, replace} from 'svelte-spa-router'
  import NotificationBadge from "./NotificationBadge.svelte";
  import ReportsNotificationBadge from "./ReportsNotificationBadge.svelte";
  import RepositoryNotificationBadge from "./RepositoryNotificationBadge.svelte";

  import {secondaryTabIndex, secondaryTabsVisible} from "./admin.js"
  
  export let projectId;
  export let tab; // this is a string of the active path

  let mainSelected; // this is a numeric index
  let selectedDropdownId = "more"; // this is a string

  const mainTabPaths = [
    '',
    'components', 
    'sheets', 
    'media', 
    'story', 
  ];
  const dropdownPaths = [
    'project',
    'users',
    'messages',
    'schedule',
    'repository',
  ];

  const updateTabFromPropChange = (newTab) => {
    console.log("tab changed from prop to:", newTab)
    if(mainTabPaths.includes(newTab)) {
      mainSelected = mainTabPaths.indexOf(newTab);
      selectedDropdownId = "more"
    }
    if(dropdownPaths.includes(newTab)) {
      selectedDropdownId = newTab;
      mainSelected = 5;
    }
  }

  $: updateTabFromPropChange(tab)
  
  const navigate = (path) => {
    if(path != undefined) {
      console.log("navigate", path)
      push(`/${projectId}/${path}`);
    }
  }

  const changeSecondaryTab = (e) => {
    //console.log("secondary Tab changed to ", e.detail)
    secondaryTabIndex.set(e.detail)
  }

</script>

<div class="tabs-left">

  <div class="tabs-main">
    <!--a use:link href="/components" >Appa</a>
    <a use:link href="/sheets" >Daten</a-->
    <Tabs autoWidth bind:selected={mainSelected} on:change={ e => navigate(mainTabPaths[e.detail])}>
      <Tab>
        Start
      </Tab>
      <Tab>
        App
        <NotificationBadge count={0} />
      </Tab>
      <Tab label="Daten" />
      <Tab label="Medien" />
      <Tab label="Story" />
      <!-- disabled tab for when dropdown is active -->
      <Tab label="" disabled />
      
    </Tabs>
    
  </div>

  <div class="extra-dropdown">

    <Dropdown
      light
      type = "inline"
      bind:selectedId={selectedDropdownId}
      on:select={ e => navigate(e.detail.selectedId) }
      let:item
      items={[
        { id: "more", text: "more", disabled: true },
        { id: "project", text: "Projekt" },
        { id: "users", text: "Users" },
        { id: "messages", text: "Messages" },
        { id: "schedule", text: "Schedule" },
        { id: "repository", text: "Repository" },
      ]}
    >
      {item.text}
      {#if item.id == "messages" }
        <ReportsNotificationBadge {projectId} />
      {/if}
      {#if item.id == "repository" }
        <RepositoryNotificationBadge />
      {/if}
    </Dropdown>

  </div>

</div>

<div class="tabs-preview" class:visible={$secondaryTabsVisible}>

  <Tabs autoWidth on:change={changeSecondaryTab}>
    <!-- separator -->
    <span class="tab-separator"><span/></span>
  
    <Tab>
        Preview
    </Tab>
    <Tab>
        Docs
      <NotificationBadge count={0} />
    </Tab>
    <Tab>
        Logs
      <NotificationBadge count={0} />
    </Tab>
  </Tabs>

</div>



<style lang="scss">

  @use '@carbon/styles/scss/theme';
  @use '@carbon/type';

  .tabs-left {
    flex:1;
    width: 100%;
    color: white;
    display: flex;
  }
  .tabs-main {
    width: 375px;
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
    width: calc(33.3333333vw - 45px);
    height: 100%;
    visibility: hidden;
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