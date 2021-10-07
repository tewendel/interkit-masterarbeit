<script>

  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import MediaFileImage from './MediaFileImage.svelte'
  import Icon from './Icon.svelte'

  export let iconColumn;
  export let labelColumn;
  
  let elements;
  onMount(async () => {
    elements  = await InterkitClient.getRowSubStore(iconColumn, { 
      iconColumn, 
      labelColumn
    })
  })

  const elementProperties = InterkitClient.getGlobalStore("elementProperties");
  if(!$elementProperties) elementProperties.set({}); 

</script>

<div class="container">

  {#if $elements?.length } 

    <ul>
      {#each $elements as element}
        <li>{element.labelColumn} 
          {#if $elementProperties[element.key]?.unlocked }
            <Icon type="check"/>
          {:else}
            <MediaFileImage mediafileRef={element.iconColumn}/>
          {/if}
        </li>
      {/each}
    </ul>

  {/if}

  <div class="info">
    <slot name="text"/>
  </div>

</div>

<style>

  .container {
    margin:  16px;
  }

  ul {
    display: flex;
  }

  li {
    width: 50px;
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    border-radius: 25px;
    padding: 10px;
    margin: 10px;
    font-size: var(--font-size-regular);
  }

  p {
    font-size: var(--font-size-regular);
    line-height: var(--line-height-regular);
  }

</style>