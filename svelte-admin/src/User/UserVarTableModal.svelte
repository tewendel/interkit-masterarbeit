<script>

  import { InterkitClient, util } from 'interkit';

  import {
      DataTable,
      Modal
  } from "carbon-components-svelte";
  
  export let user;
  export let projectId;

  let open = false;
  const openModal = () => { open = true }
  $: if(user) openModal();

  let headers=[
    { key: "key", value: "Variable" },
    { key: "value", value: "Value" },
  ]

  let rows = [];
  let vars;
  let jsonCheck = {};
  const copyVars = (user) => {
    if(!user?.projectUserData?.[projectId]?.userVars) return;
    vars = JSON.parse(JSON.stringify(user?.projectUserData?.[projectId]?.userVars));
    Object.keys(vars).forEach(k => jsonCheck[k] = true)
    console.log("copyVars", vars);
    if(vars) 
      rows = Object.keys(vars).map(key => {return {
        id: key,
        key: key,
        value: vars[key]
      }})
  }
  $: copyVars(user);
  
  const updateCell = (row, value) => {
    console.log(row, value, typeof row.value)
    if(typeof row.value == "string") {
      vars[row.key] = value;    
    }
    if(typeof row.value == "number") {
      vars[row.key] = parseFloat(value);    
    }
    if(typeof row.value == "boolean") {
      vars[row.key] = value;
    }
    if(typeof row.value == "object") {
      console.log("trying to parse json", value)
      try {
        vars[row.key] = JSON.parse(value);
        jsonCheck[row.key] = true
      }
      catch(e) {
        console.log(e)
        jsonCheck[row.key] = false
      }
    }
  }
    
</script>

<Modal
  bind:open={open}
  modalHeading="userVars"
  primaryButtonText={'save'}
  secondaryButtonText={'cancel'}
  on:click:button--secondary={() => { open = false }}
  on:submit={() => { 
      if(vars) {
        let jsonErrors = false;
        Object.keys(jsonCheck).forEach(k => {if(!jsonCheck[k]) jsonErrors = k})
        if(jsonErrors) {
          alert("There is a JSON error in variable " + jsonErrors + ". Not saving.")
          return;
        }
        InterkitClient.call('user.updateUserProjectData', {
          userId: user._id, 
          projectId, 
          key: "userVars", 
          value: vars
        })
      }
      open = false;
    }
  }
>

  {#if open}
    <DataTable {headers} {rows}>
      <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === "value"}
          {#if typeof cell.value == "string"}
            <input value={cell.value} on:input={(e)=>{updateCell(row, e.target.value)}}>
          {/if}
          {#if typeof cell.value == "number"}
            <input type="number" value={cell.value} on:input={(e)=>{updateCell(row, e.target.value)}}>
          {/if}
          {#if typeof cell.value == "boolean"}
            <input type="checkbox" checked={row.value} on:change={(e)=>{updateCell(row, e.target.checked)}}>
          {/if}
          {#if typeof cell.value == "object"}
            <textarea on:change={(e)=>{updateCell(row, e.target.value)}}>{JSON.stringify(row.value)}</textarea>
          {/if}
        {:else}
          {cell.value}
        {/if}
      </svelte:fragment>
    </DataTable>
  {/if}

</Modal>

