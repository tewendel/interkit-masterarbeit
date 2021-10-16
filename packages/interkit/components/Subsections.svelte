<script>

  import { InterkitClient } from '../'

  import { setContext, getContext } from 'svelte';
  import { writable } from 'svelte/store';
  import TopNavBar from './TopNavBar.svelte';
  import Icon from './Icon.svelte'

  let sections = [];
  let activeSection = writable(null);

  const topNavContext = getContext("TopNav");

  const selectSection = (section) => {
    activeSection.set(section);
    topNavContext?.configureNavBar(
      section.title, 
      () => { activeSection.set(null) }
    )
  }

  setContext("Subsections", {
      registerSection: ({key, title, path}) => {
        sections.push({key, title, path})
        sections = sections;
      },
      activeSection
  });
 
  const menuPath = InterkitClient.getUiKeyStore("menuPath");
  $: {
    if($menuPath) {
      console.log("menuPath", $menuPath)
      let pathSegments = $menuPath.split("/")
      console.log(pathSegments)
      for(let segment of pathSegments) {
        let targetSection = sections.filter(s => s.path == segment)?.[0]    
        if(targetSection) {
          console.log("found targetSection", targetSection)
          selectSection(targetSection)
        }  
      }
    }
  }

        
</script>

{#if !$activeSection}

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