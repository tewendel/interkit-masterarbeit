<script>

  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import TopNavBar from './TopNavBar.svelte';
  import Icon from './Icon.svelte'

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
    icon="arrow-left"
    onClick={closeSection}
  >
    {$activeSection.title}
  </TopNavBar>
  
{:else}

  <ul class="Subsections">
    {#each sections as section}
      <li class="Subsections__Entry entry" on:click={()=>{selectSection(section)}}>
        <span class="Subsections__EntryTitle entry_title">
          {section.title}
        </span>
        <span class="Subsections__EntryArrow entry_arrow">
          <Icon type="arrow-right" />
        </span>
      </li>
    {/each}
  </ul>

{/if}

<slot></slot>


<style> 
  li:hover {
    cursor: pointer;
  }

  .entry {
    margin: 0 8px;
    font-size: 20px;
    line-height: 24px;
    padding: 16px;
    padding-bottom: 15px;
    border-bottom: 1px solid black;
    display: flex;
  }

  .entry_title {
    flex: 1;
  }

</style>