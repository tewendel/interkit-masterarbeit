<script>

  import { onDestroy } from 'svelte'
  import { DataTable } from "carbon-components-svelte";

  export let mediafiles; // this should be an array, not a store
  export let radio = false;
  export let value;

  const headers = [
    { key: "name", value: "name" },
    { key: "link", value: "link" },
    { key: "preview", value: "preview" },
  ];

  let rows = [];
  
  // add links to list of mediafiles
  $: {
    rows = mediafiles ? mediafiles.map(mediafile => {
        return {
          ...mediafile,
          id: mediafile._id,
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
      {#if cell.key === 'preview' && row.isAudio}
        <audio controls>
          <source src={encodeURI(row.link)} type={row["mime-type"]}>
        </audio>        
      {:else}{cell.value}{/if}
    </span>

  </DataTable>

{:else}
  loading...
{/if}