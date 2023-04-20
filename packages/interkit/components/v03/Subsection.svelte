<script>

  import { lang } from '../i18n.js'
  import { getContext } from 'svelte';
  const { registerSection, activeSection } = getContext("Subsections");

  export let title;
  export let path;

  const key = {};

  $: {
    console.log('Subsection $', key, title, path)
    registerSection({key, title, path})
  }

  registerSection({key, title, path});

</script>

<div class:active={key == $activeSection?.key} class="Subsection {path}">
  <slot></slot>
</div>

<style>

  div {
    display: none;
  }

  div.active {
    display: block;
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    pointer-events: all;
    touch-action: auto;
    background-color: white;
    z-index: 1000;
  }


</style>
