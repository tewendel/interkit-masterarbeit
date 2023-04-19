<script>

  import { Accordion, AccordionItem, Button } from "carbon-components-svelte"; 
  import BlocklyComponentPreview from "./BlocklyComponentPreview.svelte";
  import Help from "carbon-icons-svelte/lib/Help.svelte";
  import Move from "carbon-icons-svelte/lib/Move.svelte";
  import { docsGo } from './docs.js'

  export let workspace;
  export let topBlocks;
  export let toolbox;

  let activeId = "";
  let selectedIds = [];
  let children = [];

  let subtrees = []

  $: {
    if(topBlocks) {
      subtrees = topBlocks.filter(b => b.type == "BlocklySubTree" || b.type == "AppBase");
      subtrees.sort(function(a, b) {
        const A = a.type == "AppBase" ? "AppBase" : a.getFieldValue('key') 
        const B = b.type == "AppBase" ? "AppBase" : b.getFieldValue('key')
        return (A < B) ? -1 : (A > B) ? 1 : 0;
      })
      //console.log("subtrees", subtrees)
    } else {
      subtrees = [];
    }
  }

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

  
    <div class="navigation-accordion">
      <Accordion size="sm">
        <AccordionItem title="Quick Nav">
          {#if subtrees.length}
            <ul>
            {#each subtrees as subtree} 
              <li>
                <span title={subtree.type == "AppBase" ? "AppBase" : subtree.getFieldValue('key')}>
                  {subtree.type == "AppBase" ? "AppBase" : subtree.getFieldValue('key')}
                </span>
                <div class="move-button">
                  <Button
                    kind="ghost"
                    size="small"
                    tooltipPosition="top"
                    icon={Move}
                    on:click={() => {panToSubtree(subtree)}}
                    iconDescription="center"
                  />  
                </div>
              </li>
            {/each}
            </ul>
          {:else}
            <p>When you use BlocklySubTrees, they will appear here as shortcuts.</p>
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

  .navigation-accordion {
    padding: 5px;
    margin-top: 1rem;
  }

  .navigation-accordion p {
    font-size: 90%;
    color: #999;
  }

  .navigation-accordion li:hover {
    cursor: pointer;
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
  }

  .navigation-accordion li .move-button {
    flex: 0.1;
  }



  

</style>

