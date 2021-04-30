<script>
  import { 
      FileUploader,
      ToastNotification
    } from "carbon-components-svelte";

  export let projectId

  const importEndpoint = `${INTERKIT_SERVER_URL}/import`

  let uploadStatus = "idle"
  let uploadFiles = []
  let uploadError = ""
  
  const triggerUpload = event => {
    console.log(uploadFiles)
    if (!confirm("Discard all current DB data & media files and replace by imports?")) {
      setTimeout(() => uploadFiles = [], 100)
    } else {
      const file = uploadFiles[0]
      if (uploadStatus === "idle" && file) {
        uploadStatus="uploading"
        upload(file)
      }
    }
  }

  const upload = async file => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('importfile', file);
    await fetch(importEndpoint, {
        method: 'POST',
        body: formData
    })
    .then((response) => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
    })
    .then((response) => response.json()).then((result) => {
        console.log('Success:', result);
        uploadStatus = "complete"
    })
    .catch((error) => {
        console.error('Error:', error);
        uploadFiles = []
        uploadStatus = "failed"
        uploadError = error.message
    });
  }

</script>

<FileUploader 
  on:add={triggerUpload} 
  status={uploadStatus} 
  accept={"application/zip"} 
  buttonLabel="Import DB & Media (.zip)" 
  bind:files={uploadFiles}
/>
{#if uploadError !== ""}
  <ToastNotification
    title="Upload Failed"
    subtitle={uploadError}
    caption={new Date().toLocaleString()}
  />
{/if}


<style>
</style>