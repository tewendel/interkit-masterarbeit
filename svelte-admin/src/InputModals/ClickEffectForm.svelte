<script>

  import { Select, SelectItem, TextInput } from "carbon-components-svelte";
  import { createEventDispatcher } from 'svelte'

  export let value = {};

  const effectTypes = ["none", "route", "back", "link", "linkTargetBlank", "actionTrigger", "setUIKey", "setElementAnnotation", "setUserVar"]
  /* 
  - path // used for route, 
  - url // used for link, linkTargetBlank
	- trigger // used for actionTrigger
	- key // used for setUIKey, setElementAnnotation, setUserVar
	- value // used for setUIKey, setElementAnnotation, setUserVar
  */

  const dispatch = createEventDispatcher();  
  const update = () => {    
    if(value.effectType == "none" || value.effectType == "back") {
      value.path = undefined
      value.url = undefined
      value.trigger = undefined
      value.key = undefined
      value.value = undefined
    }
    if(value.effectType == "route") {
      value.url = undefined
      value.trigger = undefined
      value.key = undefined
      value.value = undefined
    }
    if(value.effectType == "link" || value.effectType == "linkTargetBlank") {
      value.path = undefined
      value.trigger = undefined
      value.key = undefined
      value.value = undefined
    }
    if(["setUIKey", "setElementAnnotation", "setUserVar"].includes(value.effectType)) {
      value.path = undefined
      value.url = undefined
      value.trigger = undefined
    }
    dispatch("update", {...value});
  }

  </script>

  <Select labelText="effectType" bind:selected={value.effectType} on:update={update}>
      {#each effectTypes as effectType}
        <SelectItem value={effectType} text={effectType} />
      {/each}
  </Select>

  <div style="margin-top: 8px">

    {#if value.effectType == "route"}
      <TextInput labelText="path" bind:value={value.path} on:update={update}/>
    {/if}

    {#if value.effectType == "link" || value.effectType == "linkTargetBlank"}
      <TextInput labelText="url" bind:value={value.url} on:update={update}/>
    {/if}

    {#if value.effectType == "actionTrigger"}
      <TextInput labelText="trigger" bind:value={value.trigger} on:update={update}/>
    {/if}

    {#if ["setUIKey", "setElementAnnotation", "setUserVar"].includes(value.effectType)}
      <TextInput labelText="key" bind:value={value.key} on:update={update}/>
      <TextInput labelText="value" bind:value={value.value} on:update={update}/>
    {/if}

  </div>
  
  <style>
    
  </style>