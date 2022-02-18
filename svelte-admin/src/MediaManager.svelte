<script>

  import { onDestroy } from 'svelte';
  import { InterkitClient } from 'interkit'
  import MediaFileList from './MediaFileList.svelte'
  import MediaUpload from './MediaUpload.svelte'
  export let projectId

  let mediafilesStore;
  let unsubscribe;
  let mediafilesArray;
  
  let subHandle;  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('mediafiles', 'mediafiles', {projectId});
    mediafilesStore = subHandle.data
    unsubscribe = mediafilesStore.subscribe((data)=>{
      //console.log("new mediafiles", data)
      mediafilesArray = data;
    })    
  }

  onDestroy(unsubscribe);
  

</script>

<h3> upload a media file </h3>

<MediaUpload {projectId} />

<h3> media in this project ({(mediafilesArray||[]).length})</h3>

<MediaFileList mediafiles={mediafilesArray} {projectId}/>

