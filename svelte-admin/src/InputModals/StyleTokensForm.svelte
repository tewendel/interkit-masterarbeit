<script>
  import { Select, SelectItem, TextInput } from "carbon-components-svelte";
  import { createEventDispatcher } from 'svelte'
  import definitions from 'interkit/components/styleTokensConfig.json'

  export let value = {};
  
  let _value = {...value}; // make a local copy to prevent weird side effects after block duplication

  // initialize with default values
  for (let definition of definitions) {
    if(typeof _value[definition.key] == "undefined") {
      _value[definition.key] = definition.defaultValue
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
        <div class="label">
          <div class="title">
            {camelToTitle(definition.key)}
          </div>
          <div class="help">{definition.help}</div>
        </div>
        <div class="value">
          {#if definition.type === "color"}
            <TextInput type="color" bind:value={_value[definition.key]} on:change={update}/>
          {:else if definition.type === "number"}
            <TextInput type="number" bind:value={_value[definition.key]} on:change={update}/>
          {:else if definition.type === "size"}
            <TextInput type="number" bind:value={_value[definition.key]} on:change={update}/>
          {:else}
            <TextInput bind:value={_value[definition.key]} on:change={update}/>
          {/if}
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
  }
  .value {
    flex: 1;
  }
  .label {
    width: 350px;
  }
  .title {

  }
  .help {
    @include type.type-style('helper-text-01');
  }
</style>