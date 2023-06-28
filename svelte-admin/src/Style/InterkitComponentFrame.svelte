<script>
  import { setContext } from 'svelte';
  import Styling from '../../../packages/interkit/components/Styling.svelte'
  import Router from '../../../packages/interkit/components/Router.svelte'

  export let name
  export let props
  export let attributes
  export let showDummyData = true
  export let styleTokens = null

  setContext('showDummyData', showDummyData)

</script>

<div class="area">
  <h4>
    <span>&lt;</span>
    <span class="name">
      {name}
    </span>
    
      {#if props}
      <span class="props">
        {#each Object.entries(props) as [key, value]}
          <span class="prop">
            {key}="{value}"
          </span>
        {/each}
        </span>
      {/if}
    

    <span>&gt;</span>
    
    {#if attributes}
      <span class="attributes">
        {#each attributes as attribute}
          <span class="attr">
            {attribute}
          </span>
        {/each}
      </span>
    {/if}
  </h4>
  <div class="content">
    <Router>
      <Styling styleTokens={styleTokens}>
        <slot></slot>
      </Styling>
    </Router>
  </div>
</div>

<style lang="scss">
  @use '@carbon/type';
  
    h4 {
      padding-bottom: .22em;
      display: inline-flex;
      align-items: baseline;
    }

    .name {
      @include type.type-style('code-02');
    }

    .props {
      @include type.type-style('code-01');
    }

    .attr {
      @include type.type-style('label-01');
      margin-left: .5em;
    }

  
    .area {
      
    }
  
    .content {
      /*box-shadow: 1px 1px 15px lightgray;*/
      /*border: 1px solid lightgray;*/
      background-color: #fff6;
    }
</style>