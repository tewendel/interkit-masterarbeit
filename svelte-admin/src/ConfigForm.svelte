<script>

  import SheetColumnSelect from './SheetColumnSelect.svelte'
  
  export let configObj
  export let configUpdate
  export let projectId

</script>

{#if configObj}

{#each Object.keys(configObj) as key}

  <div class="field">
    <label>{configObj[key].name}</label><br>

    {#if configObj[key].type == "string"}
      <input type="text" bind:value={configObj[key].value}/>
    {/if}

    {#if configObj[key].type == "color"}
      <input type="color" bind:value={configObj[key].value}/>
    {/if}

    {#if configObj[key].type == "sheetColumn"}
      <SheetColumnSelect {projectId} bind:sheetColumn={configObj[key].value}/>
    {/if}

    {#if configObj[key].type == "boolean"}
      <input type=checkbox bind:checked={configObj[key].value}/>
    {/if}

  </div>

{/each}

<br><br>
<button on:click={()=>{configUpdate(configObj)}}>save</button>

{/if}


<style>
  .field {
    margin-bottom: 10px;
  }
</style>