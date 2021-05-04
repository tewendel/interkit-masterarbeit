<script>

  import { getContext } from 'svelte';
  const { registerSection, activeSection } = getContext("Subsections");

  export let title;

  const key = {};
  registerSection({key, title});

</script>

<div class:active={key == $activeSection?.key} class="Subsection">
  <slot></slot>
</div>

<style>

  div {
    display: none;
  }

  div.active {
    display: block;
  }

  .subsection {
  }

</style>