<script>
  import { Link } from 'svelte-navigator';
  export let condition;
  export let to;
</script>

{#if condition}
  <Link {to}>
    <slot/>
  </Link>
{:else}
  <slot/>
{/if}