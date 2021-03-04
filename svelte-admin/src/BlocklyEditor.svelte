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
    document.getElementById('textarea').value = code;
  }

  $: {
    console.log("blockly open", open)
    if(open && !workspace) {
      initBlockly();      
    }
  }

  

</script>

<div class="wrapper">  
  <div id="blocklyDiv" style="height: 480px; width: 100%;"></div>
  <textarea id="textarea"></textarea>
</div>  


<style>
  textarea {
    width: 100%;
  }
</style>