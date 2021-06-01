<script>
  import ReferenceCell from './ReferenceCell.svelte'; 
  import MediaFilePreview from './MediaFilePreview.svelte';
  export let cell;
  export let refData;
  export let projectId;
</script>

<span class="cell">

  {#if cell.value?.lat}

    <img class="marker-icon" src="leaflet/marker-icon.png"/>

  {:else if cell.value?.type == "sheetRef"}

    <ReferenceCell {refData} value={cell.value}/>

  {:else if cell.value?.type == "mediaFile"}

    <MediaFilePreview key={cell.value.value} {projectId}/>

  {:else if typeof cell.value == "number"}

    {cell.value}
    
  {:else}

      {cell.value ? cell.value : ""}

  {/if}

</span>

<style>

  .cell {
    max-height: 1.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 10em;
    white-space: nowrap;
  }

  .cell:empty:after {
    content: "–";
    opacity: 0.5;
  }
  img {
    max-height: 1.5rem;
  }

</style>