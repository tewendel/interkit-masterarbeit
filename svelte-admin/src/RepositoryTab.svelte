<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import CloudCmd from './CloudCmd.svelte'
  import RepositoryEditor from './RepositoryEditor.svelte'

  export let projectId
  export let currentProject

  let selectedTab

</script>

<Tabs bind:selected={selectedTab}>
  <Tab label="repository" />
  <Tab label="cloudcmd" />
  <div slot="content">
    <TabContent>
        <RepositoryEditor {projectId} {currentProject} open={selectedTab == 0} />
    </TabContent>
    <TabContent>
      <CloudCmd {projectId} open={selectedTab == 1} />
    </TabContent>
  </div>
</Tabs>
