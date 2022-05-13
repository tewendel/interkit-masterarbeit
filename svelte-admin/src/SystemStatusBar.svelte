<script>
  import { onMount } from 'svelte';
  import { InterkitClient } from 'interkit'
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import Warning from "carbon-icons-svelte/lib/Warning.svelte";
  
  let sub = null;
  let bundlerIsOnline = null;

  onMount(async ()=>{
    // subscribe to the status of the bundler
    sub = await InterkitClient.getSub(
      'users', 
      'user.bundler.status', 
      null, 
      u=>u.username=="bundler", 
      true
    );
    if (sub) {
      sub.data.subscribe((data)=>{
        bundlerIsOnline = data?.status?.online;
        console.log('status', status);
      })
    }
  })  
</script>

<span>
  {#if bundlerIsOnline}
    <Checkmark title="Bundler is online" />
  {:else}
    <Warning title="Bundler is offline" /> Bundler is offline
  {/if}
  
</span>

<style>
  span {
    color: white;
  }
</style>