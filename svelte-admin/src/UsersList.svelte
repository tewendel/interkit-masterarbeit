<script>

  import { onDestroy } from 'svelte'
  import { DataTable, OverflowMenu, OverflowMenuItem, Toolbar, ToolbarContent, ToolbarSearch } from "carbon-components-svelte";
  import { InterkitClient, util } from 'interkit';

  export let users; // this should be an array, not a store
  export let projectId;

  let userId = InterkitClient.userId

  const headers = [
    { key: "username", value: "username" },
    { key: "createdAt", value: "createdAt" },
    { key: "userToken", value: "userToken" },
    { key: "lastHeartbeat", value: "lastHeartbeat" },
    { key: "pushnotificationRegistrationToken", value: "pushnotificationRegistrationToken" },
  ];

  let rows = [];
  // add links to list of mediafiles
  $: {
    rows = users ? users
      .filter(user => user.id !== $userId) // hide own user
      .map(user => {
        return {
          ...user,
          userToken: user?.projectUserData?.[projectId]?.userToken,
          lastHeartbeat: user?.projectUserData?.[projectId]?.lastHeartbeat,
          pushnotificationRegistrationToken: user?.projectUserData?.[projectId]?.pushnotificationRegistrationToken
        }
    })
    : []
  }

  let searchQuery;
  const searchFunction = (row, query) => {
    //console.log(m)
    if(!query || query == "") return true;
    else {
      if(row?.userToken?.toLowerCase().includes(query.toLowerCase())
        || row?.username?.toLowerCase()?.includes(query.toLowerCase())) {
        return true
      } else {
        return false;
      }
    }
  }

  let rowsFiltered = [];
  $: {
    rowsFiltered = rows.filter((row)=>{return searchFunction(row, searchQuery)})
    //console.log(rows, rowsFiltered)
  }

  /*const removeRow = (row)=> {
    if(confirm("permanently delete mediafile?")) {
      InterkitClient.call('mediafile.delete', {key: row.meta.key, projectId})   
    }
  }*/
  
</script>

{#if rows}

  <div class="UsersListTableContainer">
    <DataTable expandable sortable {headers} rows={rowsFiltered}>

      <Toolbar>
        <ToolbarContent>
          <ToolbarSearch bind:value={searchQuery}/>
        </ToolbarContent>
      </Toolbar>

      <div slot="expanded-row" let:row>
        <pre>
          {JSON.stringify(row, null, 2)}
        </pre>
      </div>

      <span slot="cell" let:row let:cell>
        {#if cell.key === 'overflow'}
            {#if row.name != "empty"}
              <OverflowMenu style="float: right" flipped>
                <OverflowMenuItem on:click={()=>{removeRow(row)}} text="remove" />
              </OverflowMenu>
            {/if}
        {:else}
          <span class="truncate">
            {cell.value || ""}
          </span>
        {/if}
      </span>

    </DataTable>
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