<script>

  import { onMount } from 'svelte'
  import CodeEditor from '../Atoms/CodeEditor.svelte'
  import { BundleServer } from '../BundleServer.js'
  import { Button } from "carbon-components-svelte";

  import { currentProjectReadOnly } from '../admin';

  export let projectId;
  export let active;

  let code;
  let filename = "actions.js";

  const load = async () => {
    console.log("loading actions.js")
    let codeFile = await BundleServer.loadSrcFile({filename, projectId})    
    //console.log("codeFile", codeFile)
    code = codeFile?.content
  }

  const save = async ()=>{
    console.log("saving actions")
    let actionsFile = {
      filename,
      content: code
    }
    await BundleServer.saveSrcFile({file: actionsFile, projectId})    
  }

  const saveAndCompile = async (dev=false)=>{
    await save();
    BundleServer.compileReloadPreview(dev);
  }

  onMount(async ()=>{
    await load();
  })

  let activated = false;
  $: {
    if(active) activated = true;
  }

</script>

{#if code && activated}
  <CodeEditor bind:code/>
  <br/>
  <div class="main-buttons">
    <Button 
      size="field"
      disabled={$currentProjectReadOnly}
      on:click={()=>saveAndCompile(true)}>Save</Button>
  </div>
{:else}
  <span>loading actions.js</span>
{/if}

<style>

.main-buttons {
  z-index: 1000;
  position: absolute;
  right: 0;
  top: 0;
}

</style>

