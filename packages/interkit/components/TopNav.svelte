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
    {pageOpen}
  >
    {label}
  </TopNavBar>
{/if}

<div class:active={pageOpen} class="TopNav__Page">

  <slot></slot>

</div>


<style>

  div {
    display: none;
  }

  div.active {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

</style>