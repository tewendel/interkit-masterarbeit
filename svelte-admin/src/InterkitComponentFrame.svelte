<script>
  import { setContext } from 'svelte';

  export let name
  export let showDummyData = true

  setContext('showDummyData', showDummyData)

</script>

<div class="area">
  <h4>&lt;{name}&gt;</h4>
  <div class="content">
    <slot></slot>
  </div>
</div>

<style lang="scss">
  @use '@carbon/type';
  
    h4 {
      @include type.type-style('label-01');
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