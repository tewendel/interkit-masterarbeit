<script>

  import { Tabs, Tab, TabContent } from "carbon-components-svelte";

  import { onDestroy } from 'svelte';
  import { InterkitClient } from 'interkit'
  import MediaFileList from './MediaFileList.svelte'
  import MediaUpload from './MediaUpload.svelte'
  export let projectId

  let mediafilesStore;
  let unsubscribe;
  let allMediafilesArray
  
  let subHandle;  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('mediafiles', 'mediafiles', {projectId});
    mediafilesStore = subHandle.data
    unsubscribe = mediafilesStore.subscribe((data)=>{
      //console.log("new mediafiles", data)
      allMediafilesArray = data;
    })    
  }

  onDestroy(unsubscribe);
  
  let selectedTab

  let mediafiles = [[], []]
  let count = [0, 0]

  $: {
    mediafiles[0] = allMediafilesArray?.filter?.(f => !f.meta?.userGenerated) || []
    mediafiles[1] = allMediafilesArray?.filter?.(f => f.meta?.userGenerated) || []
  }

</script>

<Tabs bind:selected={selectedTab}>
  <Tab label={`Project (${mediafiles[0].length})`} />
  <Tab label={`User generated (${mediafiles[1].length})`} />
  <div slot="content">
    <TabContent>
      <MediaUpload {projectId} />
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
