<script>

  export let inverse = false;
  export let mainClass = ''

</script>

<div
  class="Loading loading {mainClass}"
  class:inverse
  class:Loading--inverse={inverse}
  >
  <span></span>
</div>

<style>

</style>
