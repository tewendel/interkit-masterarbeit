<script>

  import { onDestroy } from 'svelte'
  import {
    DataTable,
    Pagination,
    OverflowMenu,
    OverflowMenuItem,
    Toolbar,
    ToolbarContent,
    ToolbarSearch
  } from "carbon-components-svelte"

  import MediaFilePreview from './MediaFilePreview.svelte'
  import { InterkitClient, util } from 'interkit'

  export let mediafiles; // this should be an array, not a store
  export let radio = false;
  export let value;
  export let projectId;
  export let filter

  const headers = [
    { key: "name", value: "name" },
    { key: "type", value: "type" },
    { key: "duration", value: "duration" },
    { key: "preview", value: "preview", sort: false },
    { key: "link", value: "link", sort: false },
    { key: "chat", value: "chat", sort: false },
    { key: "overflow", sort: false, empty: true },
  ];

  let rows = [];
  // add links to list of mediafiles
  $: {
    rows = mediafiles ? mediafiles.map(mediafile => {
        return {
          ...mediafile,
          id: mediafile.meta.key,
          duration: util.formatDuration(mediafile.meta.duration),          
          link: INTERKIT_SERVER_URL + mediafile._downloadRoute + "/mediafiles/" + mediafile._id + "/original/" + mediafile._id + mediafile.extensionWithDot,
          chat: JSON.stringify(mediafile.meta)
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
      if(m?.name.toLowerCase().includes(query.toLowerCase())
        || m?.type?.toLowerCase()?.includes(query.toLowerCase())) {
        return true
      } else {
        return false;
      }
    }
  }

  let rowsFiltered = [];
  $: {
    rowsFiltered = rows
      // .filter(filter)
      .filter((m)=>{return searchFunction(m, searchQuery)})
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

  let pagination = {
    pageSize: 30,
    page: 1
  }
  
</script>

{#if rows}

  <div class="MediaFileListTableContainer">
    <DataTable
      sortable
      {radio}
      bind:selectedRowIds
      pageSize={pagination.pageSize}
      page={pagination.page}
      {headers}
      rows={rowsFiltered}
      >

      <Toolbar>
        <ToolbarContent>
          <ToolbarSearch bind:value={searchQuery}/>
        </ToolbarContent>
      </Toolbar>

      <span slot="cell" let:row let:cell>
        {#if cell.key === 'overflow'}
            {#if row.name != "empty"}
              <OverflowMenu style="float: right" flipped>
                <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
                <OverflowMenuItem on:click={()=>{alert(row.meta?.key)}} text="show key" />
              </OverflowMenu>
            {/if}
        {:else if cell.key === 'type' && cell.value}
          {row.type}
        {:else if cell.key === 'preview'}
          <MediaFilePreview key={row.meta?.key} {projectId} mediaManager/>
        {:else if cell.key === 'link' && cell.value}
          <a href={row.link} title={row.link} target="_blank" class="truncate">url</a>
        {:else}{cell.value || ""}{/if}
      </span>

    </DataTable>
    <Pagination
      bind:pageSize={pagination.pageSize}
      bind:page={pagination.page}
      totalItems={rows.length}
      pageSizes={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
      />
  </div>

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
