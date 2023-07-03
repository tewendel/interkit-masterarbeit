<script>

  import { Accordion, AccordionItem, Button } from "carbon-components-svelte"; 
  import BlocklyComponentPreview from "./BlocklyComponentPreview.svelte";
  import Help from "carbon-icons-svelte/lib/Help.svelte";
  import { docsGo } from '../docs.js'

  import CenterIcon from "carbon-icons-svelte/lib/CenterToFit.svelte";

  export let workspace;
  export let toolbox;
  export let topBlocks;
  export let blockDefinitionsYaml; // unprocessed block definitions loaded from yaml

  let activeId = "";
  let selectedIds = [];
  let children = [];

  let subtrees = []

  // blocks that appear as quick nav links at the bottom
  let quickNavTypes = ["Group", "AppBase", "Route", "DataRouteSingle", "DataRouteMulti", "ChatRoute"]

  // gets the title to show in quick nav from block
  const quickNavblockToString = (block) => {
    switch(block.type) {
      case "AppBase": return "AppBase";
      case "Group": return block.getFieldValue("name");
      default: return block.getFieldValue("path");
    }
  }

  $: {
    if(topBlocks) {
      subtrees = topBlocks.filter(b => quickNavTypes.includes(b.type))
      subtrees.sort(function(a, b) {
        const A = quickNavblockToString(a)
        const B = quickNavblockToString(b)
        return (A < B) ? -1 : (A > B) ? 1 : 0;
      })
      //console.log("subtrees", subtrees)
    } else {
      subtrees = [];
    }
  }

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

  const selectComponent = (blockName) => {
    //if(confirm("add " + blockName + " to workspace?")) {
      let newBlock = workspace.newBlock(blockName);
      newBlock.initSvg();
      newBlock.moveBy((workspace.getMetrics().viewLeft + 20) / workspace.scale, (workspace.getMetrics().viewTop + 20) / workspace.scale);
      newBlock.render();
    //}
  }

  const openBlocklyHelp = (blockName) => {
    const blockDef = blockDefinitionsYaml.find(b => b.name == blockName)
    const docsPath = blockDef?.docsPath || blockName // use either explicit docsPath or block name
    docsGo(`/components/${docsPath}`)
  }

  const referenceHelp = () => {
    docsGo(`/components/BlocklySubtree`)
  }

  const panToSubtree = (block) => {
    let xy = block.getRelativeToSurfaceXY();	// Scroll the workspace so that the block's top left corner
    let m = workspace.getMetrics();					// is in the (0.2; 0.3) part of the viewport.
    
    console.log({scrollbar: workspace.scrollbar, metrics: m, xy: xy})
    
    workspace.scrollbar.set(
        xy.x * workspace.scale - m.contentLeft + m.viewWidth  * 0.2,
				xy.y * workspace.scale - m.contentTop + m.viewHeight * 0.3
    );
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
            add={()=>{selectComponent(block.text)}}
            help={()=>{openBlocklyHelp(block.text)}}
            bind:activeBlockPreview
          />
        {/each}
      </AccordionItem>    
    {/each}
    </Accordion>

  
    <div class="navigation-accordion">
      <Accordion size="sm">
        <AccordionItem title="Quick Nav">
          {#if subtrees.length}
            <ul>
            {#each subtrees as subtree} 
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <li class="subtree" on:click={() => {panToSubtree(subtree)}}>
                <span title={quickNavblockToString(subtree)}>
                  {quickNavblockToString(subtree)}
                </span>
                <div class="move-button">
                  <CenterIcon/>
                </div>
              </li>
            {/each}
            </ul>
          {/if}
          {#if subtrees.length == 1}
            <p>Groups and Routes will appear here as shortcuts.</p>
            <Button
                kind="ghost"
                size="small"
                tooltipPosition="top"
                tooltipAlignment="end"
                icon={Help}
                on:click={referenceHelp}
                iconDescription="docs"
              />
          {/if}
        </AccordionItem>    
      </Accordion>
    </div>

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

  .navigation-accordion {
    margin-top: 1rem;
  }

  .navigation-accordion p {
    font-size: 90%;
    color: #999;
  }

  .navigation-accordion li {
    display: flex;
    flex-direction: row;
  }

  .navigation-accordion li span {
    flex: 0.9;
    align-self: center;
    overflow: hidden;
    padding: 2px;
    text-overflow: "...";
    white-space: nowrap;
  }

  .navigation-accordion li .move-button {
    flex: 0.1;
  }

  .move-button {
    padding: 4px;
  }

  .subtree {
    padding: 2px;
  }

  .subtree:hover {
    cursor: pointer;
    background-color: lightgray;
  }



  

</style>

