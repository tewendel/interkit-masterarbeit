<script>

  import { InterkitClient } from 'interkit'
  export let projectId

  let mediafiles;
  let mediafilesWithLinks = [];
  let subHandle;  
  $: resetSub(projectId)

  const resetSub = async (projectId) => {
    if(subHandle) await subHandle.stop()
    subHandle = await InterkitClient.getSub('mediafiles', 'mediafiles', [projectId]);
    mediafiles = subHandle.data
    console.log($mediafiles)

    mediafiles.subscribe(data => {
      mediafilesWithLinks = data.map(mediafile => {
        return {
          ...mediafile,
          link: INTERKIT_SERVER_URL + mediafile._downloadRoute + "/mediafiles/" + mediafile.id + "/original/" + mediafile.id + mediafile.extensionWithDot
        }
      })
    })
  }

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

{#if mediafiles}
  <ul>
  {#each mediafilesWithLinks as mediafile}

    <li>{mediafile.name} <a target="_blank" href="{mediafile.link}">link</a>
    {#if mediafile.isAudio}
      <audio controls>
        <source src={encodeURI(mediafile.link)} type={mediafile["mime-type"]}>
      </audio>        
    {/if}
    </li>
          
  {/each}
  </ul>
{:else}
  loading...
{/if}