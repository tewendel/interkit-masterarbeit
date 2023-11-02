<script>
  import marked from "marked";
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";

  export let theme;
</script>

{#if theme?.meta}
  <StructuredList condensed>
    <StructuredListBody>
      {#each Object.entries(theme?.meta || {}) as [key, value]}
        <StructuredListRow>
          <StructuredListCell noWrap>
            {key}
          </StructuredListCell>
          <StructuredListCell>
            {value}
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
{/if}

{#if theme?.readme}
  <section class="info">
    {@html marked(theme?.readme)}
  </section>
{/if}

<style>
  .info {
    padding: 15px;
  }
</style>
