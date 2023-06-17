<script>
  import { setContext } from 'svelte';
  import Styling from '../../../packages/interkit/components/Styling.svelte'
  import Router from '../../../packages/interkit/components/Router.svelte'

  export let name
  export let showDummyData = true
  export let styleTokens = null

  setContext('showDummyData', showDummyData)

</script>

<div class="area">
  <h4>&lt;{name}&gt;</h4>
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
      @include type.type-style('code-01');
      padding-bottom: .22em;
    }
  
    .area {
      
    }
  
    .content {
      /*box-shadow: 1px 1px 15px lightgray;*/
      /*border: 1px solid lightgray;*/
      background-color: #fff6;
    }
</style>