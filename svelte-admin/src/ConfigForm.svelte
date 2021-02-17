<script>
  
  export let configObj
  export let configUpdate

</script>

{#if configObj}

{#each Object.keys(configObj) as key}

  <div class="field">
    <label>{configObj[key].name}</label><br>
    <input type="text" bind:value={configObj[key].value}/>
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