<script>
  import ReferenceCell from './ReferenceCell.svelte'; 
  import MediaFilePreview from './MediaFilePreview.svelte';
  export let cell;
  export let refData;
  export let projectId;
</script>

{#if cell.value?.lat}

  <img class="marker-icon" src="leaflet/marker-icon.png"/>

{:else if cell.value?.type == "sheetRef"}

  <ReferenceCell {refData} value={cell.value}/>

{:else if cell.value?.type == "mediaFile"}

  <MediaFilePreview key={cell.value.value} {projectId}/>

{:else}

  {cell.value ? cell.value : ""}

{/if}

<style>

  img {
    max-height: 1.5rem;
  }

</style>