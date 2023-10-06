<script>

  import { onDestroy } from 'svelte';

  import {
    Tabs,
    Tab,
    TabContent,
    Button,
    ButtonSet
  } from "carbon-components-svelte"

  import Help from "carbon-icons-svelte/lib/Help.svelte"

  import { InterkitClient } from 'interkit'
  import { docsGo } from '../docs.js'

  import MediaFileList from './MediaFileList.svelte'
  import MediaUpload from './MediaUpload.svelte'
  import { currentProjectReadOnly } from '../admin.js';

  export let projectId

  let mediafilesStore;
  let unsubscribe;
  let allMediafilesArray
  
  let subHandle;  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('mediafiles', 'mediafiles', {projectId}, f=>f?.meta?.projectId == projectId);
    mediafilesStore = subHandle.data
    console.log("mediafilesStore", $mediafilesStore)
    unsubscribe = mediafilesStore.subscribe((data)=>{
      //console.log("new mediafiles", data)
      allMediafilesArray = data;
    })    
  }

  onDestroy(() => {
    if(unsubscribe) unsubscribe()
  });
  
  let selectedTab

  let mediafiles = [[], []]
  let count = [0, 0]

  $: {
    mediafiles[0] = allMediafilesArray?.filter?.(f => !f.meta?.userGenerated) || []
    mediafiles[1] = allMediafilesArray?.filter?.(f => f.meta?.userGenerated) || []
  }

</script>

<div class="__MediaManager">
  <Tabs bind:selected={selectedTab}>
    <Tab label={`Project (${mediafiles[0].length})`} />
    <Tab label={`User generated (${mediafiles[1].length})`} />
    <div slot="content">
      <TabContent>
        {#if !$currentProjectReadOnly}<MediaUpload {projectId} />{/if}
        <MediaFileList
          mediafiles={mediafiles[0]}
          {projectId}
          />
      </TabContent>
      <TabContent>
        <MediaFileList
          mediafiles={mediafiles[1]}
          showChatCols={true}
          {projectId}
          />
      </TabContent>
    </div>
  </Tabs>
  <div class="main-buttons">
    <ButtonSet>
      <!-- size=field matches Tabs in height -->
      <Button
        icon={Help}
        kind="ghost"
        size="field"
        on:click={() => docsGo('/guides/overview/interface_overview#media')}
        >Help</Button>
    </ButtonSet>
  </div>
</div>

<style>

  .__MediaManager {
    position: relative;
  }

  .main-buttons {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }

</style>
