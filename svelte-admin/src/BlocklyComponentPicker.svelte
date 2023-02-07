<script>

  import { TreeView } from "carbon-components-svelte";

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
      console.log(children)

    }
  }

  const selectComponent = ({ detail }) => {
    if(detail.leaf) {
      let name = detail.id;
      if(confirm("add " + name + " to workspace?")) {
        let newBlock = workspace.newBlock(name);
        newBlock.initSvg();
        newBlock.moveBy((workspace.getMetrics().viewLeft + 20) / workspace.scale, (workspace.getMetrics().viewTop + 20) / workspace.scale);
        newBlock.render();
      }
    }
  }

  
</script>


{#if toolbox}

  <TreeView
    {children}
    bind:activeId
    bind:selectedIds
    on:select={selectComponent}
  />

{/if}

