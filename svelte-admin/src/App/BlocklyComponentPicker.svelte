<script>

  import { createEventDispatcher } from 'svelte'

  import { Accordion, AccordionItem } from "carbon-components-svelte"; 
  import BlocklyComponentPreview from "./BlocklyComponentPreview.svelte";
  
  import { docsGo } from '../docs.js'

  export let toolbox;
  export let blockDefinitionsYaml; // unprocessed block definitions loaded from yaml

  const dispatch = createEventDispatcher()

  let children = [];
  
  const buildCategories = (toolbox) => {
    if(toolbox) {
      // build categories
      children = toolbox?.contents.filter(c => c.kind == "category").map(c => { return {
        id: c.name,
        text: c.name
      }})
      console.log(children)

      // build components
      children.forEach(c => {
        c.children = toolbox.contents.find(t => t.name == c.text).contents.map(child => { return {
          id: child.type,
          text: child.type,
          block: child
        }})
      })

      children.sort(function(a, b) {
        var textA = a.text.toUpperCase();
        var textB = b.text.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      })
      console.log("toolbox children", children)

    }
  }

  $: {
    buildCategories(toolbox);
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
      openCategory = category.text
    }, 10)
  }
  
</script>


{#if toolbox}

  <div class="blockly-picker-container">
    
    <Accordion size="sm">
    {#each children as category}
      <AccordionItem 
        title={category.text} 
        open={category.text == openCategory} 
        on:click={()=>{manageAccordeonOpen(category)}}
      >
        {#each category.children as block}
          <BlocklyComponentPreview 
            blockName={block.text} 
            add={() => dispatch('addcomponent', block.text)}
            help={()=>{openBlocklyHelp(block.text)}}
            helpHref={getBlocklyHelpHref(block.text)}
            bind:activeBlockPreview
            on:startdrag={evt => dispatch('startdrag', evt.detail)}
          />
        {/each}
      </AccordionItem>    
    {/each}
    </Accordion>

  
    

  </div>


  

{/if}

<style>
  .blockly-picker-container {
    padding: 5px;
  }

  :global(.blockly-picker-container .bx--accordion__content) {
    padding-right: 1rem;
  }

  :global(.bx--accordion__title) {
    text-overflow: ellipsis;
    overflow: hidden;
  }





  

</style>

