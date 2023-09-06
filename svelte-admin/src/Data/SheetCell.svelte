<script>
  import ReferenceCell from './ReferenceCell.svelte'; 
  import MediaFilePreview from '../Media/MediaFilePreview.svelte';
  import NotAvailable from 'carbon-icons-svelte/lib/NotAvailable.svelte'

  export let cell;
  export let refData;
  export let projectId;
</script>


<span class="cell">
  {#if $$slots.default}

    <slot />

  {:else if cell.value?.lat}

    <img class="marker-icon" src="leaflet/marker-icon.png"/>

  {:else if cell.value?.type == "sheetRef"}

    <span class="truncate">
      <ReferenceCell {refData} value={cell.value}/>
    </span>

  {:else if cell.value?.type == "mediaFile"}

    <MediaFilePreview key={cell.value.value} {projectId} border/>

  {:else if typeof cell.value == "number"}

    <span class="cell">
      {cell.value}
    </span>
    
  {:else}

    {#if cell.value}

      <span class="truncate">
        {cell.value}
      </span>

    {:else}
      
      <NotAvailable/>
      
    {/if}

  {/if}
</span>


<style>

  .cell {    
    display: flex;
    position: relative;
    height: 3em;
    align-items: center;
  }

  .cell:hover:after {
    content: "";
    border: 1px solid #aaa;
    border-radius: 0.5rem;
    position: absolute;
    top: -1px;
    left: -7px;
    right: 0;
    bottom: 0;
    width: 100%;
    padding: 3px 6px;
    pointer-events: none;
    backdrop-filter: contrast(1.1);
  }

  .truncate {    
    overflow: hidden;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 10em;
    white-space: nowrap;
    display: block;
    position: relative;
  }

  img {
    max-height: 1.5rem;
  }

</style>
