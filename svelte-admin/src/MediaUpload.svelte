<script>
  import Dropzone from "svelte-file-dropzone";
  import { InterkitClient, util } from 'interkit'

  export let projectId

  let files = {
    accepted: [],
    rejected: [],
    uploaded: [],
    failed: []
  };

  let filesStatus = []

  async function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
    for (let i = 0; i < acceptedFiles.length; i++) {
      uploadFile(acceptedFiles[i]);
    }
  }

  const uploadEndpoint = INTERKIT_SERVER_URL + "/mediaUpload"
  
  function uploadFile(file) {
    const formData = new FormData();
    console.log("upload ", file.path, file.name, file.size, file.type)
    formData.append('mediafile', file);
    formData.append('projectId', projectId);
    fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
    })
    .then((response) => {
      console.log(response)
      return response.json()
    })
    .then((result) => {
      console.log('Success:', result);
      files.uploaded = [...files.uploaded, file];
    })
    .catch((error) => {
      console.error('Error:', error);
      files.failed = [...files.failed, file];
    });
  }
  
  $: {
    filesStatus = files.accepted.map( file => {
      const status = files.uploaded.findIndex( f => f === file) > -1 ? "uploaded" 
        : files.failed.findIndex( f => f === file) > -1 ? "failed"
        : "uploading..."
      const color = status == "uploaded" ? "darkgreen" : status == "failed" ? "red" : "blue"

      return {
        file,
        status,
        color
      }
    })
  }

</script>

<Dropzone
  on:drop={handleFilesSelect}
  multiple={true}
  containerStyles="color: #444; border-color: #888; margin: 1em 0;"
  >
  <p><strong>UPLOAD</strong></p>
  <p>Drag &amp; drop file here, or click to select files</p>
</Dropzone>

<ol>
  {#each filesStatus as item}
    <li style={`color: ${item.color}`}>
      {item.file.name}
      ({item.file.size} bytes)
      :
      { item.status }
    </li>
  {/each}
</ol>
