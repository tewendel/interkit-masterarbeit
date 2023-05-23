<script>
  import { setContext } from 'svelte';

  export let name
  export let showDummyData = true

  setContext('showDummyData', showDummyData)

</script>

<div class="area">
  <h4>{name}</h4>
  <div class="content">
    <slot></slot>
  </div>
</div>

<style lang="scss">
  @use '@carbon/type';
  
    h4 {
      @include type.type-style('label-01');
    }
  
    .area {
      
    }
  
    .content {
      box-shadow: 1px 1px 15px lightgray;
    }
</style>