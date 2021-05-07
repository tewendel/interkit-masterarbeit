<script>

  import { onDestroy } from 'svelte'
  import { DataTable, OverflowMenu, OverflowMenuItem, Toolbar, ToolbarContent, ToolbarSearch } from "carbon-components-svelte";
  import MediaFilePreview from './MediaFilePreview.svelte';
  import { InterkitClient } from 'interkit';

  export let mediafiles; // this should be an array, not a store
  export let radio = false;
  export let value;
  export let projectId;

  const headers = [
    { key: "name", value: "name" },
    { key: "type", value: "type" },
    { key: "preview", value: "preview", sort: false },
    { key: "link", value: "link", sort: false },
    { key: "overflow", sort: false, empty: true },
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
    if(radio && mediafiles) {
      rows = rows.concat({name: "empty", value: null})
    }
  }

  let searchQuery;
  const searchFunction = (m, query) => {
    //console.log(m)
    if(!query || query == "") return true;
    else {
      if(m.name.toLowerCase().includes(query.toLowerCase())
        || m.type.toLowerCase().includes(query.toLowerCase())) {
        return true
      } else {
        return false;
      }
    }
  }

  let rowsFiltered = [];
  $: {
    rowsFiltered = rows.filter((m)=>{return searchFunction(m, searchQuery)})
    //console.log(rows, rowsFiltered)
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

  const removeRow = (row)=> {
    if(confirm("permanently delete mediafile?")) {
      InterkitClient.call('mediafile.delete', {key: row.meta.key, projectId})   
    }
  }
  
</script>

{#if rows}

  <DataTable sortable {radio} bind:selectedRowIds {headers} rows={rowsFiltered}>

    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch bind:value={searchQuery}/>
      </ToolbarContent>
    </Toolbar>

    <span slot="cell" let:row let:cell>
      {#if cell.key === 'overflow' && cell.value}
        <OverflowMenu style="float: right" flipped>
          <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
          <OverflowMenuItem on:click={()=>{alert(row.meta?.key)}} text="show key" />
        </OverflowMenu>
      {:else if cell.key === 'type' && cell.value}
        {row.type}
      {:else if cell.key === 'preview'}
        <MediaFilePreview key={row.meta?.key} {projectId} mediaManager/>
      {:else if cell.key === 'link' && cell.value}
        <a href={row.link} title={row.link} target="_blank" class="truncate">url</a>
      {:else}{cell.value || ""}{/if}
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