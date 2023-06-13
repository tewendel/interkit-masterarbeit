<script>
  import { onMount } from 'svelte';
  import { InterkitClient } from 'interkit'
  import { currentProject } from '../admin.js'
  import Checkmark from "carbon-icons-svelte/lib/CheckmarkOutline.svelte";
  import Warning from "carbon-icons-svelte/lib/Warning.svelte";
  
  $: currentProjectServerStatus = $currentProject?.projectServer?.status
  $: viteServerStatus = $currentProject?.uiState?.viteServer?.status

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

  {#if $currentProject}
    {#if viteServerStatus == "running"}
      <Checkmark title="Vite server is running" />
    {:else}
      <Warning title={"Vite server " + viteServerStatus} style="color:orange;"/>
    {/if}
  {/if}

  &nbsp;

  {#if $currentProject}
    {#if currentProjectServerStatus == "running"}
      <Checkmark title="Project server is running" />
    {:else}
      <Warning title={"Project server " + currentProjectServerStatus} style="color:red;"/>
    {/if}
  {/if}
  
  &nbsp;

  {#if connected}
    <Checkmark title="Connected to server" />
  {:else}
    <Warning title="Disconnected from server" style="color:red;"/>
  {/if}
  
  &nbsp;
  
  {#if bundlerIsOnline}
    <Checkmark title="Bundler is online" />
  {:else}
    <Warning title="Bundler is offline" style="color:red;"/>
  {/if}
  
</span>

<style lang="scss">
  @use '@carbon/styles/scss/theme';

  span {
    color: white /*theme.$text-primary*/;
  }
</style>