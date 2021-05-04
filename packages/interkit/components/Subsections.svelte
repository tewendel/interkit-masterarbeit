<script>

  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import TopNavBar from './TopNavBar.svelte';

  let sections = [];
  let activeSection = writable(null);

  const { setNavBarVisibility } = getContext("TopNav");

  const selectSection = (section) => {
    activeSection.set(section);
    setNavBarVisibility(false);
    //console.log("activeSection", $activeSection)
  }

  setContext("Subsections", {
      registerSection: ({key, title}) => {
        //console.log("registerSection", title)
        sections.push({key, title})
        sections = sections;
        //console.log(sections)
      },
      activeSection
  });

  const closeSection = () => {
    activeSection.set(null);
    setNavBarVisibility(true);
  }
        
</script>

{#if $activeSection}

  <TopNavBar
    label={$activeSection.title}
    back={true}
    onClick={closeSection}
  />
  
{:else}

  <ul>
    {#each sections as section}
      <li on:click={()=>{selectSection(section)}}>{section.title}</li>
    {/each}
  </ul>

{/if}

<slot></slot>


<style> 
  li:hover {
    cursor: pointer;
  }

</style>