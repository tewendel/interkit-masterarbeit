<script>

  import ContentElementAudio from './ContentElementAudio.svelte';
  
  export let title;
  export let elementRows;
  export let elementColumns;
  export let categoryColumns;
  export let categoryIndex = 0;

</script>

<h3>{title}</h3>

{#if elementRows}
  <div class="slider-container">
    {#if elementRows.length}
      {#each elementRows as element}
        <ContentElementAudio
          {element}
          {elementColumns}
          {categoryColumns}
          {categoryIndex}
        />
      {/each}
    {/if}
  </div>
{/if}


<style> 

  .slider-container {
    display: flex;
  }

  .slider-container > div {
    border: 1px solid gray;
    padding: 5px;
    
  }


</style>