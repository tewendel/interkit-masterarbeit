<script>

  import ContentElementAudio from './ContentElementAudio.svelte';
  
  export let title;
  export let elementRows;

  export let titleColumn;
  export let descriptionColumn;
  export let audioColumn;
  export let imageColumn;

</script>

<h3>{title}</h3>

{#if elementRows}
  <div class="slider-container">
    {#each elementRows as element}
      <ContentElementAudio
        {element}
        nameColumn = {titleColumn}
        {audioColumn}
        {descriptionColumn}
        {imageColumn}
      />
    {/each}
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