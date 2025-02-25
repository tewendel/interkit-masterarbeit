<script>
  import { Select, SelectItem, TextInput, NumberInput } from "carbon-components-svelte";
  import { createEventDispatcher } from 'svelte'
  import definitions from 'interkit/components/styleTokensConfig.json'

  export let value = {};
  export let cloneInputObject = false
  
  let _value = {}
  export let equalsDefaults = false
  
  if (cloneInputObject) {
    _value = {...value}; // make a local copy to prevent weird side effects after block duplication
  }
  
  $: if (!cloneInputObject) _value = value || {} // use the input object directly

  // initialize with default values
  $: {
    equalsDefaults = true
    for (let definition of definitions) {
      if(typeof _value[definition.key] == "undefined") {
        _value[definition.key] = definition.defaultValue
      } else {
        if (_value[definition.key] !== definition.defaultValue) equalsDefaults = false
      }
    }
  }

  const dispatch = createEventDispatcher();  
  const update = (e) => {    
    console.log("StyleTokensForm dispatch", _value);
    dispatch("update", _value);
  }

  const camelToKebab = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
  }

  const camelToTitle = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 / $2')
      // capitalize the first letter
      .replace(/^./, function(str){ return str.toUpperCase(); })
  }

  const groupByCategory = (definitions) => {
    const categories = {}
    definitions.forEach(definition => {
      if(!categories[definition.category]) categories[definition.category] = []
      categories[definition.category].push(definition)
    })
    return categories
  }

  </script>

<div style="margin-top: 8px">
  {#each Object.entries(groupByCategory(definitions)) as [category, defs]}
    <div class="category">{category.replace(/^./, function(str){ return str.toUpperCase(); })}</div>
    {#each defs as definition}
      <div class="field">
        <div class="value">
          {#if definition.type === "color"}
            <TextInput title={_value[definition.key]} type="color" bind:value={_value[definition.key]} on:change={update}/>
          {:else if definition.type === "number"}
            <NumberInput title={_value[definition.key]} step={0.05} bind:value={_value[definition.key]} on:change={update}/>
          {:else if definition.type === "size"}
            <TextInput title={_value[definition.key]} type="text" bind:value={_value[definition.key]} on:change={update}/>
          {:else}
            <TextInput title={_value[definition.key]} bind:value={_value[definition.key]} on:change={update}/>
          {/if}
        </div>        
        <div class="label">
          <div class="title" title={definition.key}>
            {camelToTitle(definition.key)}
          </div>
          <div class="help">{definition.help}</div>
        </div>
      </div>
    {/each}
  {/each}

</div>

<style lang="scss">
  @use '@carbon/type';

  .category {
    margin-top: 16px;
    margin-bottom: 8px;
    @include type.type-style('heading-compact-02');
  }
  .field {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 8px;
    gap: 16px;
  }
  .value {
    width: 30%;
    max-width: 300px;
    min-width: 100px;
  }
  .label {
    flex: 1;
  }
  .title {

  }
  .help {
    @include type.type-style('helper-text-01');
  }
</style>
