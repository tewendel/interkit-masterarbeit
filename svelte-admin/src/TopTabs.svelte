<script>
  import { Tabs, Tab, Dropdown } from "carbon-components-svelte";
  import {push, pop, replace} from 'svelte-spa-router'
  import NotificationBadge from "./NotificationBadge.svelte";

  export let projectId;
  export let tab;

  const tabPaths = [
    '',
    'components', 
    'sheets', 
    'media', 
    'story', 
    'project',
    'users',
    'messages',
    'schedule',
    'repository'
  ];

  $: selected = tabPaths.indexOf(tab || '');

  const navigate = (e) => {
    console.log('navigate', e);
    push(`/${projectId}/${tabPaths[e]}`);
  }

</script>

<div class="tabs">
  <!--a use:link href="/components" >Appa</a>
  <a use:link href="/sheets" >Daten</a-->
  <Tabs autoWidth bind:selected on:change={ e => navigate(e.detail)}>
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
    <Tab label="Projekt" />
    
    <!-- separator -->
    <span style="flex:1; border-left: solid 1px #eee"></span>

    <Tab>
      <small>
        Users
      </small>
    </Tab>
    <Tab>
      <small>
        Messages
      </small>
      <NotificationBadge count={0} />
    </Tab>
    <Tab>
      <small>
        Schedule
      </small>
      <NotificationBadge count={0} />
    </Tab>
    <Tab>
      <small>
        Repository
      </small>
    </Tab>

  </Tabs>
  
</div>



<style lang="scss">

  @use '@carbon/styles/scss/theme';
  @use '@carbon/type';

  .tabs {
    flex:1;
    width: 100%;
    color: white;
  }

  small {
    @include type.type-style('helper-text-01');
  }
</style>