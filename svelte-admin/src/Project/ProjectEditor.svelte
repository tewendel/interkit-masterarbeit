<script>
  import { 
      Row,
      Column,
      Button,
      TextInput
    } from "carbon-components-svelte";
  import ImportProject from './ImportProject.svelte'
  import { InterkitClient } from 'interkit'
  import { BundleServer} from '../BundleServer'
  import ProjectServerInfo from './ProjectServerInfo.svelte'
  import HistoryList from './HistoryList.svelte'

  import { currentProjectReadOnly } from '../admin.js'

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
  const makeDefaultProject = async () => await InterkitClient.call("project.makeDefaultProject", {projectId})

  const exportEndpoint = `${INTERKIT_SERVER_URL}/export/`

</script>

{#if $currentProject}

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
      {$currentProject?.name}
    </dt>
  </dl>

  <Row>
    <Column>
      <TextInput inline labelText="Project Slug"  bind:value={slug} disabled={$currentProjectReadOnly} />
    </Column>
    <Column>
      {#if slug != $currentProject?.slug}
        <Button on:click={saveSlug} size="small" disabled={$currentProjectReadOnly}>Save</Button>
        <Button on:click={cancelSlug} size="small" kind="tertiary">Cancel</Button>
      {/if}
    </Column>
  </Row>


  <h4>
    Default Project
  </h4>
  <p>
    {#if $currentProject.isDefaultProject}
      This project is the default project served at 
      <a href={BundleServer.getServerURL()} target="_blank">
        {BundleServer.getServerURL()}
      </a>
    {:else}
    <p>
      The default project will be served at 
      <a href={BundleServer.getServerURL()} target="_blank">
        {BundleServer.getServerURL()}
      </a>
    </p>
      <Button 
        kind="ghost"
        disabled={$currentProjectReadOnly}
        on:click={makeDefaultProject}
      >
      Make this project the default project
      </Button>
    {/if}
  </p>

  <h4>Import/Export Database & Media</h4>

  <ImportProject {projectId} />

  <Button 
    size="small" 
    href={exportEndpoint + `?projectId=${projectId}`}
  >Export DB & Media (.zip)</Button>

  <h4>Project History</h4>
  <HistoryList {currentProject} />

{/if}

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