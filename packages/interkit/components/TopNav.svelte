<script>

  import TopNavBar from './TopNavBar.svelte';

  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  let showNavBar = true;

  setContext("TopNav", {
      setNavBarVisibility: (value) => {
        showNavBar = value
      }
  });
  
  export let label;

  let pageOpen = false;
  const togglePage = () => {
    pageOpen = !pageOpen;
  }

</script>

{#if showNavBar}
  <TopNavBar
    onClick={togglePage}
    icon={pageOpen ? "arrow-left" : "settings"}
  >
    {label}
  </TopNavBar>
{/if}

<div class:active={pageOpen} class="page">

  <slot></slot>

</div>


<style>

  div {
    display: none;
  }

  div.active {
    display: block;
    height: 100%;
    width: 100%;
  }

</style>