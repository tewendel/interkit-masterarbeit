<script>
  import { 
    Row,
    Column,
    Button,
  } from "carbon-components-svelte";
  import { InterkitClient } from 'interkit'

  export let currentProject // $currentProject

  $: messages = ($currentProject?.projectServer?.messages || []).sort( (a,b) => b.date - a.date )
  $: status = $currentProject?.projectServer?.status
  $: actionRequested = $currentProject?.projectServer?.actionRequested

  const dateTimeFormatShort = new Intl.DateTimeFormat('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: false,
  });

  const dateTimeFormatLong = new Intl.DateTimeFormat('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour12: false,
  });

  function start() {
    actionRequested = true // simple optimistic ui
    InterkitClient.call('project.projectServer.start', {projectId: $currentProject._id})
  }

  function stop() {
    actionRequested = true // simple optimistic ui
    InterkitClient.call('project.projectServer.stop', {projectId: $currentProject._id})
  }

  function clear() {
    InterkitClient.call('project.projectServer.clearMessages', {projectId: $currentProject._id})
  }

</script>

<div class="container" data-status={$currentProject?.projectServer?.status}>
  {#if status && status != "init"}
    <Button on:click={() => status === "running" ? stop() : start() } size="small" kind="secondary" disabled={!!actionRequested}>
      {#if status === "running"}
        Stop
      {:else}
        Start
      {/if}
    </Button>
  {/if}
  <span class="status">
    Status: {$currentProject?.projectServer?.status}
  </span>
  <Button on:click={() => clear() } size="small" kind="tertiary">
    Clear Log
  </Button>
  <div class="messages">
    {#each messages as message}
      <div class="message">
        <span class="date" title={dateTimeFormatLong.format(message.date)}>
          {dateTimeFormatShort.format(message.date)}
        </span>
        <span class="type">
          {message.type}
        </span>
        <span class="text">
          {message.text}
        </span>
      </div>
    {/each}
  </div>
</div>

<style>
  .status {
    text-transform: capitalize;
    display: inline-flex;
    padding: 1ex 1em;
  }
  .status:before {
    content: "●";
    padding-right: 0.5em;
    color: transparent;
  }
  [data-status="running"] .status:before {
    color: #4f9f52;
  }
  .messages {
    height: 300px;
    overflow-y: scroll;
    display:flex;
    flex-direction: column-reverse;
    background: white;
    border: 1px solid black;
    font-family: monospace;
  }
  .message {
    padding: 0.5ex;
    white-space: pre-wrap;
  }
  .message + .message {
    border-bottom: 1px solid lightgrey;
  }
  .date {
    background: blue;
    color: white;
  }
  .type {
    background: yellow;
  }
</style>