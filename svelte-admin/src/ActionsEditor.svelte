<script>

  import { onMount } from 'svelte'
  import CodeEditor from './CodeEditor.svelte'
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'
  import { Button } from "carbon-components-svelte";

  export let projectId;
  export let active;

  let code;
  let filename = "actions.js";

  const load = async () => {
    console.log("loading actions.js")
    let codeFile = await InterkitClient.call("file.load", {filename, projectId})    
    //console.log("codeFile", codeFile)
    code = codeFile?.content
  }

  const save = async ()=>{
    let actionsFile = {
      filename,
      content: code
    }
    await InterkitClient.call("file.save", {file: actionsFile, projectId})
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
  <Button on:click={()=>saveAndCompile(true)}>save</Button>
{:else}
  <span>loading actions.js</span>
{/if}


