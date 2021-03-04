<script>

  import {onMount} from 'svelte'
  
  import Blockly from 'blockly'
  import { blocklyConfig } from 'interkit-shared'

  export let open;

  
  blocklyConfig.initCodeGenerator(Blockly);

  Blockly.defineBlocksWithJsonArray(blocklyConfig.definitions);
  
  let workspace;

  const initBlockly = () => {
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: blocklyConfig.toolbox
    });
    workspace.addChangeListener(myUpdateFunction);
  }

  const myUpdateFunction = (event) => {
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    
    // add import statements
    let allBlocks = workspace.getAllBlocks().map(b=>b.type)
    let allBlocksUnique = allBlocks.filter((e, i) => allBlocks.indexOf(e) === i)
    
    let imports = "<script>\n";
    for(let type of allBlocksUnique) {
      imports += `import ${type} from "interkit-shared";\n`
    }
    imports += "</"+"script>\n\n" // writing this as two strings to escape svelte compiler

    document.getElementById('textarea').value = imports + code;
  }

  $: {
    console.log("blockly open", open)
    if(open && !workspace) {
      initBlockly();      
    }
  }

  

</script>

<div class="wrapper">  
  <div id="blocklyDiv" style="height: 350px; width: 100%;"></div>
  <textarea id="textarea"></textarea>
</div>  


<style>
  textarea {
    width: 100%;
    height: 150px;
  }
</style>