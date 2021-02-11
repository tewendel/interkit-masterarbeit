<script>
  
  export let configObj
  export let configUpdate

</script>

{#if configObj}

<h2>config form</h2>

{#each Object.keys(configObj) as key}

  <div>
    <label>{configObj[key].name}</label><br>
    <input type="text" bind:value={configObj[key].value}/>
  </div>

{/each}

<button on:click={()=>{configUpdate(configObj)}}>save</button>

{/if}