<script>
  import { 
      Row,
      Column,
      Button,
      TextInput
    } from "carbon-components-svelte";
  import ImportProject from './ImportProject.svelte'
  import { InterkitClient } from 'interkit'

  export let projectId
  export let currentProject

  let slug = ""

  //console.log(currentProject)

  const initSlug = function(projectId) {
    slug = $currentProject.slug
  }

  $: initSlug(projectId)

  const cancelSlug = () => slug = $currentProject.slug
  const saveSlug = async () => await InterkitClient.call("project.setSlug", {projectId, slug})

  const exportEndpoint = `${INTERKIT_SERVER_URL}/export/`

</script>

<h4>Info</h4>
<dl>
  <dd>
    Project ID
  </dd>
  <dt>
    {projectId}
  </dt>
  <dd>
    Project name
  </dd>
  <dt>
    {$currentProject.name}
  </dt>
</dl>

<Row>
  <Column>
    <TextInput inline labelText="Project Slug"  bind:value={slug} />
  </Column>
  <Column>
    {#if slug != $currentProject.slug}
      <Button on:click={saveSlug} size="small">Save</Button>
      <Button on:click={cancelSlug} size="small" kind="tertiary">Cancel</Button>
    {/if}
  </Column>
</Row>

<h4>Import/Export Database & Media</h4>

<ImportProject {projectId} />

<Button size="small" href={exportEndpoint + `?projectId=${projectId}`}>Export DB & Media (.zip)</Button>

<h4>Snapshots (coming soon)</h4>

<style>
  h4 {
    margin-top: 1em;
    margin-bottom: 1ex;
  }

  dd {
    float: left;
  }

  dd,dt {
    padding: 0 1ex 1ex 0;
  }
  dd:after {
    content: ": ";
  }
</style>