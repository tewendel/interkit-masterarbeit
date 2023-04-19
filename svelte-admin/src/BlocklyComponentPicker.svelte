<script>

  import { Accordion, AccordionItem } from "carbon-components-svelte"; 
  import BlocklyComponentPreview from "./BlocklyComponentPreview.svelte";
  import { docsGo } from './docs.js'

  export let workspace;
  export let toolbox;

  let activeId = "";
  let selectedIds = [];
  let children = [];

  $: {
    if(toolbox) {
      children = toolbox?.contents.filter(c => c.kind == "category").map(c => { return {
        id: c.name,
        text: c.name
      }})
      console.log(children)

      children.forEach(c => {
        c.children = toolbox.contents.find(t => t.name == c.text).contents.map(child => { return {
          id: child.type,
          text: child.type
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

  const selectComponent = (blockName) => {
    if(confirm("add " + blockName + " to workspace?")) {
      let newBlock = workspace.newBlock(blockName);
      newBlock.initSvg();
      newBlock.moveBy((workspace.getMetrics().viewLeft + 20) / workspace.scale, (workspace.getMetrics().viewTop + 20) / workspace.scale);
      newBlock.render();
    }
  }

  const openBlocklyHelp = (blockName) => {
    //alert("open help for " + blockName)
    docsGo(`/components/${blockName}`)

  }

</script>


{#if toolbox}

  <div class="blockly-picker-container">

    <Accordion size="sm">
    {#each children as category}
      <AccordionItem title={category.text}>
        {#each category.children as block}
          <BlocklyComponentPreview 
            blockName={block.text} 
            add={()=>{selectComponent(block.text)}}
            help={()=>{openBlocklyHelp(block.text)}}
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


</style>

