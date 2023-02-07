<script>
  import { Tabs, Tab } from "carbon-components-svelte";
  import NotificationBadge from "./NotificationBadge.svelte";

  let activeTab = 0;
</script>

<div class="tabs">
  <Tabs autoWidth on:change={ e => activeTab = e.detail }>
      <Tab>
        App
        <NotificationBadge count={3} />
      </Tab>
      <Tab label="Story" />
      <Tab label="Daten" />
      <Tab label="Medien" />
      <Tab label="Projekt" />
      <Tab label="Tab" />
  </Tabs>
</div>



<style lang="scss">

  @use '@carbon/styles/scss/theme';

  .tabs {
    flex:1;
    width: 100%;
    color: white;
  }
</style>