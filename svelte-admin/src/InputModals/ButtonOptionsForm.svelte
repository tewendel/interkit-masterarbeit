<script>

  import { Select, SelectItem, TextInput } from "carbon-components-svelte";
  import { createEventDispatcher } from 'svelte'

  export let value = {};
  let _value = {...value}; // make a local copy to prevent weird side effects after block duplication

  const dispatch = createEventDispatcher();  
  const update = () => {    
    
    console.log("ButtonOptionsForm dispatch", _value);
    dispatch("update", _value);
  }

  const buttonTypes = ["secondary", "primary", "ghost", "link", "danger"]
  const buttonSizes = ["medium", "small", "large"]
  const buttonFlexOptions = ["normal", "fill"]

  </script>

  <TextInput labelText="text" bind:value={_value.text} on:change={update}/>
  
  <Select labelText="type" bind:selected={_value.type} on:update={update}>
      {#each buttonTypes as buttonType}
        <SelectItem value={buttonType} text={buttonType} />
      {/each}
  </Select>

  <Select labelText="size" bind:selected={_value.size} on:update={update}>
    {#each buttonSizes as buttonSize}
      <SelectItem value={buttonSize} text={buttonSize} />
    {/each}
  </Select>

  <Select labelText="flex" bind:selected={_value.flex} on:update={update}>
    {#each buttonFlexOptions as flexOption}
      <SelectItem value={flexOption} text={flexOption} />
    {/each}
</Select>

