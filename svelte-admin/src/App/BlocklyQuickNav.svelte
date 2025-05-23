<script>
  import { Accordion, AccordionItem, Button } from "carbon-components-svelte"; 
  import CenterIcon from "carbon-icons-svelte/lib/CenterToFit.svelte";
  import Help from "carbon-icons-svelte/lib/Help.svelte";

  export let topBlocks;
  export let workspace;
  
  let subtrees = []
  
  // blocks that appear as quick nav links at the bottom
  let quickNavTypes = ["Group", "AppBase", "Route", "DataRouteSingle", "DataRouteMulti", "ChatRoute"]

  // how to group them
  const groups = [
    {
      name: "AppBase",
      types: ["AppBase"]
    },
    {
      name: "Routes",
      types: ["Route", "DataRouteSingle", "DataRouteMulti", "ChatRoute"]
    },    
    {
      name: "Groups",
      types: ["Group"]
    }
  ]

  $: {
    if(topBlocks) {
      subtrees = groups.map(group => ({
        name: group.name,
        blocks: topBlocks
          .filter(b => group.types.includes(b.type))
          .sort((a, b) => {
            const A = quickNavblockToString(a);
            const B = quickNavblockToString(b);
            return (A < B) ? -1 : (A > B) ? 1 : 0;
          })
      })).filter(group => group.blocks.length > 0);
    } else {
      subtrees = [];
    }
  }

  // gets the title to show in quick nav from block
  const quickNavblockToString = (block) => {
    switch(block.type) {
      case "AppBase": return "AppBase";
      case "Group": return block.getFieldValue("name");
      default: return block.getFieldValue("path");
    }
  }

  const referenceHelp = () => {
    docsGo(`/reference/components/BlocklySubtree`)
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




<div class="navigation-accordion">
  {#if subtrees.length}
    {#each subtrees as group}
      <div class="group">
        <h4 class="group-title">{group.name}</h4>
        <ul>
          {#each group.blocks as subtree}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <li class="subtree" on:click={() => panToSubtree(subtree)}>
              <span title={quickNavblockToString(subtree)}>
                {quickNavblockToString(subtree)}
              </span>
              <div class="move-button">
                <CenterIcon/>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  {:else}
    <p>Groups and Routes will appear here as shortcuts that you can jump to. This is useful for larger projects.</p>
  {/if}
</div>

<style lang="scss">

  @use '@carbon/styles/scss/theme';
  @use '@carbon/type';
.group {
    margin-bottom: 1.5rem;
}
  
.group-title {
  @include type.type-style("heading-compact-01");
  border-bottom: 2px solid theme.$border-subtle-03;
  color: theme.$text-secondary;
  padding: 4px;
}
  
  .navigation-accordion {
    margin-top: 1rem;
    padding: 5px;
  }

  .navigation-accordion p {
    font-size: 90%;
    color: #999;
    padding: 0.5em;
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