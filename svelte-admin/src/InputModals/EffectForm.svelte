<script>

  import { Select, SelectItem, TextInput } from "carbon-components-svelte";
  import { createEventDispatcher } from 'svelte'

  export let value = {};
  let _value = {...value}; // make a local copy to prevent weird side effects after block duplication

  const effectTypes = ["none", "route", "dataRouteSingle", "back", "link", "linkTargetBlank", "actionTrigger", "setUIKey", "setDataAnnotation", "setUserVar"]
  /* 
  - path // used for route, 
  - url // used for link, linkTargetBlank
	- trigger // used for actionTrigger
	- key // used for setUIKey, setDataAnnotation, setUserVar
	- value // used for setUIKey, setDataAnnotation, setUserVar
  */

  const dispatch = createEventDispatcher();  
  const update = () => {    
    if(_value.effectType == "none" || _value.effectType == "back") {
      _value.path = undefined
      _value.url = undefined
      _value.trigger = undefined
      _value.key = undefined
      _value.value = undefined
    }
    if(_value.effectType == "route" || _value.effectType == "dataRouteSingle") {
      _value.url = undefined
      _value.trigger = undefined
      _value.key = undefined
      _value.value = undefined
    }
    if(_value.effectType == "link" || _value.effectType == "linkTargetBlank") {
      _value.path = undefined
      _value.trigger = undefined
      _value.key = undefined
      _value.value = undefined
    }
    if(["setUIKey", "setDataAnnotation", "setUserVar"].includes(_value.effectType)) {
      _value.path = undefined
      _value.url = undefined
      _value.trigger = undefined
    }

    console.log("ClickeEffectForm dispatch", _value);
    dispatch("update", _value);
  }

  </script>

  <Select labelText="effectType" bind:selected={_value.effectType} on:update={update}>
      {#each effectTypes as effectType}
        <SelectItem value={effectType} text={effectType} />
      {/each}
  </Select>

  <div style="margin-top: 8px">

    {#if _value.effectType == "route" || _value.effectType == "dataRouteSingle"}
      <TextInput labelText="path" bind:value={_value.path} on:change={update}/>
    {/if}

    {#if _value.effectType == "link" || _value.effectType == "linkTargetBlank"}
      <TextInput labelText="url" bind:value={_value.url} on:change={update}/>
    {/if}

    {#if _value.effectType == "actionTrigger"}
      <TextInput labelText="trigger" bind:value={_value.trigger} on:change={update}/>
    {/if}

    {#if ["setUIKey", "setDataAnnotation", "setUserVar"].includes(_value.effectType)}
      <TextInput labelText="key" bind:value={_value.key} on:change={update}/>
      <TextInput labelText="value" bind:value={_value.value} on:change={update}/>
    {/if}

  </div>
  
  <style>
    
  </style>