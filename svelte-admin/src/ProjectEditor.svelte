<script>
  import { 
      Button,
    } from "carbon-components-svelte";
  import ImportProject from './ImportProject.svelte'

  export let projectId

  const exportEndpoint = `${INTERKIT_SERVER_URL}export/`

</script>

<h4>Info</h4>
<p>
  Project ID: {projectId}
</p>

<h4>Import/Export Database & Media</h4>

<ImportProject {projectId} />

<Button size="small" href={exportEndpoint + `?projectId=${projectId}`}>Export DB & Media (.zip)</Button>


<h4>Snapshots (coming soon)</h4>

<style>
  h4 {
    margin-top: 1em;
  }
</style>