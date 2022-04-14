<script>

  import { onMount, onDestroy } from 'svelte'
  import { DataTable, OverflowMenu, OverflowMenuItem, Toolbar, ToolbarContent, ToolbarSearch } from "carbon-components-svelte";
  import { InterkitClient, util } from 'interkit';

  export let users; // this should be an array, not a store
  export let projectId;
  export let previewUserId

  let userId = InterkitClient.userId

  let usersSelection = []

  let quickMsgText = 'hello'
  let quickMsgChannel = 'board1'

  const headers = [
    { key: "username", value: "username" },
    { key: "id", value: "id" },
    { key: "createdAt", value: "createdAt" },
    { key: "userToken", value: "userToken" },
    { key: "lastHeartbeat", value: "lastHeartbeat" },
    { key: "pushnotificationRegistrationToken", value: "pushnotificationRegistrationToken" },
    { key: "ctrls" },
  ];

  let rows = [];
  // add links to list of mediafiles
  $: {
    rows = users ? users
      // .filter(user => user.id !== $userId) // hide own user
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

  const quickMsgSend = () => {
    InterkitClient.call('message.send', {
      projectId,
      sender: userId,
      channel_key: quickMsgChannel,
      recipients: usersSelection.map(_ => _._id),
      payload: {
        type: 'text',
        text: quickMsgText
      }
    })
  }
  
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
        {:else if cell.key === 'username'}
          {#if row.id === $userId}
            &#x1F464;&#xFE0E;
          {/if}
          {#if row.id === previewUserId}
            &#x1F4F1;&#xFE0E;
          {/if}
          { cell.value }
        {:else if cell.key === 'ctrls'}
          <input type="checkbox" bind:group={usersSelection} name="usersSelection" value={row} />
        {:else}
          <span class="truncate">
            {cell.value || ""}
          </span>
        {/if}
      </span>

    </DataTable>
  </div>

  <div>
    quick message
    <label>msg txt <input bind:value={quickMsgText} /></label>
    <label>channel <input bind:value={quickMsgChannel} /><label>
    <button on:click={()=>{quickMsgSend()}} disabled={usersSelection.length===0}>send</button><br/>
    {#if usersSelection.length}
      …to {usersSelection.map(_ => _._id).join(', ')}
    {:else}
      <i>(select some users)</i>
    {/if}
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
