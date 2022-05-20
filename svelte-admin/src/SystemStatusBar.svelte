<script>
  import { onMount } from 'svelte';
  import { InterkitClient } from 'interkit'
  import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
  import Warning from "carbon-icons-svelte/lib/Warning.svelte";
  
  export let currentProjectServerStatus

  let sub = null;
  let bundlerIsOnline = null;
  let connected = false;

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
      })
    }
  })

  InterkitClient.connected.subscribe( c =>{
    connected = c;
  })
</script>

<span>
  {#if currentProjectServerStatus}
    {#if currentProjectServerStatus == "running"}
      <Checkmark title="Project server is running" />
    {:else}
      <Warning title={"Project server " + currentProjectServerStatus} /> {"Project server " + currentProjectServerStatus}
    {/if}
  {/if}
  
  &nbsp;

  {#if connected}
    <Checkmark title="Connected to server" />
  {:else}
    <Warning title="Disconnected from server" /> Server is offline
  {/if}
  
  &nbsp;
  
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