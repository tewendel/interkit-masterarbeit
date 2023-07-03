<script context="module">
  // data
  //    - object containing key of a media object and mime tpye
  //    - example: {mediaKey: result.key, mimeType: "video/mp4"}
  // column
  //    - interkit sheet/column key
  export async function addElement(data, column) {
    const sheetKey = util.getSheetKey(column);
    const { mediaKey } = data

    if (column) {

      let result = await InterkitClient.call('sheet.addRow', {
        sheetKey
      })

      const rowKey = result.rowKey
      const colKey = util.colKey(column)

      result = await InterkitClient.call('row.updateValue',{
        rowKey, 
        colKey,
        newVal: {value: mediaKey, type: "mediaFile"}
      })

      return result
    }
  }

  export async function addTextElement(text, column) {
    const sheetKey = util.getSheetKey(column);

    if (column) {

      let result = await InterkitClient.call('sheet.addRow', {
        sheetKey
      })

      const rowKey = result.rowKey
      const colKey = util.colKey(column)

      console.log(rowKey, colKey, text)

      result = InterkitClient.call('row.updateValue',{
        rowKey, 
        colKey,
        newVal: text
      })

      return result
    }
  }
</script>

<script>
  import Dropzone from "svelte-file-dropzone";
  import { InterkitClient, util } from '../'
  import { executeTrigger } from '../actions.js'

  export let imageColumn
  export let audioColumn
  export let videoColumn
  export let textColumn
  export let uploadedTrigger

  const colKeyMapping = {
    'audio': audioColumn,
    'video': videoColumn,
    'image': imageColumn,
    'text': textColumn,
  }

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
      if (acceptedFiles[i].type == "text/plain") {
        const text = await acceptedFiles[i].text()
        //console.log(text)
        files.uploaded = [...files.uploaded, acceptedFiles[i]];
        const result = await addTextElement(text, textColumn)
        console.log("text", text, textColumn, result)
        if (uploadedTrigger) executeTrigger(uploadedTrigger, result)
      } else {
        uploadFile(acceptedFiles[i]);
      }
    }
  }

  const uploadEndpoint = InterkitClient.getUploadEndpoint()
  console.log("uploadEndpoint", uploadEndpoint);

  const projectId = InterkitClient.projectId;
  console.log("projectId", $projectId);

  function uploadFile(file) {
    const formData = new FormData();
    console.log("upload ", file.path, file.name, file.size, file.type)
    formData.append('mediafile', file);
    formData.append('projectId', $projectId);
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
      const type = file.type.split("/")[0]
      const col = colKeyMapping[type]
      return addElement({mediaKey: result.key, mimeType: file.type}, col)
    })
    .then((result) => {
      if (uploadedTrigger) executeTrigger(uploadedTrigger, result)
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

<!-- TODO specify class here somehow -->
<Dropzone on:drop={handleFilesSelect} multiple={true} />

<ol class="Upload__Files">
  {#each filesStatus as item}
    <li class="Upload__FileItem" style={`color: ${item.color}`}>
      {item.file.name}
      ({item.file.size} bytes)
      :
      { item.status }
    </li>
  {/each}

</ol>
