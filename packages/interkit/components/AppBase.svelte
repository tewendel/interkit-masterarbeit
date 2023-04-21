<script>
  import AppBaseAdvanced from './AppBaseAdvanced.svelte'
  export let languages

</script>

<AppBaseAdvanced
  {languages}
>
  <slot/>
</AppBaseAdvanced>

