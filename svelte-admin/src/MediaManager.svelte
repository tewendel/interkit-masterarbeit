<script>

  import { onDestroy } from 'svelte';
  import { InterkitClient } from 'interkit'
  import MediaFileList from './MediaFileList.svelte'
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

  const uploadEndpoint = INTERKIT_SERVER_URL + "/mediaUpload"

  let files;
  
  const upload = () => {
    console.log(uploadEndpoint);
    const formData = new FormData();
    formData.append('mediafile', files[0]);
    formData.append('projectId', projectId);
    const upload = fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json()).then((result) => {
        console.log('Success:', result);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  const link = async (mediafile) => {
    let res = await InterkitClient.call("mediafile.link", {id: mediafile.id})
    alert(res)
  }

</script>

<h3> upload a media file </h3>

<input id="fileUpload" type="file" bind:files>
<button on:click={upload}>Upload</button>
<br/><br/>

<h3> media in this project </h3>

<MediaFileList mediafiles={mediafilesArray} {projectId}/>

