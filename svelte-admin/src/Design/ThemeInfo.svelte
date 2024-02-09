<script>
  import Markdown from "../Atoms/Markdown.svelte";

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
    <Markdown source={theme?.readme} />
  </section>
{/if}

<style>
  .info {
    padding: 15px;
    margin: 15px;
    background: white;
  }
</style>
