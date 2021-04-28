<script>

  import { onDestroy } from 'svelte'
  import { DataTable } from "carbon-components-svelte";
  import MediaFilePreview from './MediaFilePreview.svelte';

  export let mediafiles; // this should be an array, not a store
  export let radio = false;
  export let value;
  export let projectId;

  const headers = [
    { key: "name", value: "name" },
    { key: "preview", value: "preview" },
    { key: "key", value: "key" },
    { key: "link", value: "link" },
  ];

  let rows = [];
  
  // add links to list of mediafiles
  $: {
    rows = mediafiles ? mediafiles.map(mediafile => {
        return {
          ...mediafile,
          id: mediafile.meta.key,          
          link: INTERKIT_SERVER_URL + mediafile._downloadRoute + "/mediafiles/" + mediafile._id + "/original/" + mediafile._id + mediafile.extensionWithDot
        }
    })
    : []
  }

  let selectedRowIds = [value?.value];
  $: {
    //console.log(selectedRowIds[0])
    value = {
      value: selectedRowIds[0],
      type: "mediaFile"
    }
    //console.log(value)
  }
  
</script>

{#if rows}

  <DataTable {radio} bind:selectedRowIds {headers} {rows}>

    <span slot="cell" let:row let:cell>
      {#if cell.key === 'preview'}
        <MediaFilePreview key={row.meta.key} {projectId} mediaManager/>
      {:else if cell.key === 'key'}
        {row.meta.key}
      {:else if cell.key === 'link'}
        <a href={row.link} title={row.link} target="_blank" class="truncate">url</a>
      {:else}{cell.value}{/if}
    </span>

  </DataTable>

{:else}
  loading...
{/if}

<style>
  .truncate {
    max-width: 10em;
    display: inline-block;
    text-align:right;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>