<script>

  import { createEventDispatcher } from 'svelte'

  import { Accordion, AccordionItem, Search } from "carbon-components-svelte"; 
  import BlocklyComponentPreview from "./BlocklyComponentPreview.svelte";
  
  import { docsGo } from '../docs.js'

  export let blockDefinitionsYaml; // unprocessed block definitions loaded from yaml

  const dispatch = createEventDispatcher()

  let blockLibrary = {}
  const libraryStructure = {
    "Layout and Structure": ["Shells", "Containers", "Spacers", "Layout Utilities", "Groups", "Routing"],
    "Interface and Interaction": ["Basics", "Buttons", "Navigation", "Media", "Modals"],
    "Data Handling and Display": ["Data Loaders", "Data Display (single)", "Data Display (multi)", "Chat", "Map"],
    "Specialized": ["AppBase", "User", "Conditionals", "Debug", "Project"]
  }

  // build hierarchical blockLibrary object with sections and categories
  const buildBlockLibrary = (blockDefinitionsYaml) => {
    if(!blockDefinitionsYaml) return

    for(let section of Object.keys(libraryStructure)) {
      if(!blockLibrary[section]) {
        blockLibrary[section] = {}
      }
      for(let category of libraryStructure[section]) {
        console.log(category, blockDefinitionsYaml.filter(b => b.toolboxCategory == category))
        blockLibrary[section][category] = blockDefinitionsYaml.filter(b => b.toolboxCategory == category)
      }  
    }
    console.log("blockLibrary", blockLibrary)
  }

  $: {
    buildBlockLibrary(blockDefinitionsYaml);
  }
  
  const openBlocklyHelp = blockName => {
    const docsPath = getBlocklyHelpHref(blockName)
    docsGo(`/reference/components/${docsPath}`)
  }

  const getBlocklyHelpHref = blockName => {
    const blockDef = blockDefinitionsYaml.find(b => b.name == blockName)
    return blockDef?.docsPath || blockName // use either explicit docsPath or block name
  }

  let activeBlockPreview;

  let openCategory = null;
  const manageAccordeonOpen = (category) => {
    activeBlockPreview = null;
    // without timeout, AccordeonItem snaps back
    setTimeout(()=> {
      openCategory = category
    }, 10)
  }

  let componentSearchQuery
  let componentSearchResults = []

  const updateComponentSearchResults = (query) => {
    if(blockDefinitionsYaml)
      componentSearchResults = blockDefinitionsYaml.filter(b => b.name?.toLowerCase().includes(query?.toLowerCase()))
  }

  $: {
    updateComponentSearchResults(componentSearchQuery)
  }
  
</script>

{#if blockDefinitionsYaml}

  <Search
    placeholder={`Search...`}
    bind:value={componentSearchQuery}
  />

  <div class="blockly-picker-container">

  {#if componentSearchQuery}

    {#each componentSearchResults as block}
      {#key block.name}
        <BlocklyComponentPreview 
          blockName={block.name} 
          add={() => dispatch('addcomponent', block.name)}
          help={()=>{openBlocklyHelp(block.name)}}
          helpHref={getBlocklyHelpHref(block.name)}
          bind:activeBlockPreview
          on:startdrag={evt => dispatch('startdrag', evt.detail)}
        />
      {/key}
    {/each}

  {:else}
      
      {#each Object.keys(blockLibrary) as section}
        <div class="block-section">
          <span class="block-section-label">{section}</span>

          <Accordion size="sm">
            {#each Object.keys(blockLibrary[section]) as category}
              <AccordionItem 
                title={category} 
                open={category == openCategory} 
                on:click={()=>{manageAccordeonOpen(category)}}
              >
                {#each blockLibrary[section][category] as block}
                  <BlocklyComponentPreview 
                    blockName={block.name} 
                    add={() => dispatch('addcomponent', block.name)}
                    help={()=>{openBlocklyHelp(block.name)}}
                    helpHref={getBlocklyHelpHref(block.name)}
                    bind:activeBlockPreview
                    on:startdrag={evt => dispatch('startdrag', evt.detail)}
                  />
                {/each}
              </AccordionItem>    
            {/each}
          </Accordion>
        

        </div>
      {/each}

    {/if}

  </div>

{/if}


<style>

  .block-section {
    padding: 16px 0 16px 0;
  }

  .block-section-label {
    display: block;
    margin-bottom: 8px;
    padding-left: 8px;
    height: 18px; 
    color: #a2a2a2; 
    font-weight: 400; 
  }

  .blockly-picker-container {
    padding: 5px;
  }

  :global(.blockly-picker-container .bx--accordion__content) {
    padding-right: 1rem;
  }

  :global(.bx--accordion__item, .bx--accordion__item:last-child) {
    border: 0;
  }

  :global(.bx--accordion__title) {
    text-overflow: ellipsis;
    overflow: hidden;
  }





  

</style>

