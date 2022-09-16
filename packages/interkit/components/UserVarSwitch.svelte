<script>

  import { InterkitClient } from '../'
  import { get } from "svelte/store"
  import Button from "./Button.svelte"

  const projectDataStore = InterkitClient.userProjectDataStore

  let userId = InterkitClient.userId

  export let userVarName;

  const setUserVar = (value) => {
    InterkitClient.call('user.setUserVar', {
      userId: get(userId),
      varName: userVarName,
      value
    })
  }

</script>

<div>{userVarName}: <span>{$projectDataStore?.userVars?.[userVarName] || 'false'}</span></div>
<div class="buttons">
{#if $userId}
  <Button on:click={() => setUserVar(true)}>enable</Button>
  <Button on:click={() => setUserVar(false)}>disable</Button>
{/if}
</div>
    
<style>

  .buttons {
    padding-top: var(--distance-s);
    padding-bottom: var(--distance-s);
  }


</style>
