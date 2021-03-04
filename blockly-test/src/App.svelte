<script>

  import {onMount} from 'svelte'
  import Blockly from 'blockly'

  import './code_generator.js'

  import block_definitions from './block_definitions.json'
  import toolbox from './toolbox.json'

  console.log(block_definitions)

  Blockly.defineBlocksWithJsonArray(block_definitions);
  
  let workspace;

  onMount(()=> {
    workspace = Blockly.inject('blocklyDiv', {
      toolbox
    });

    workspace.addChangeListener(myUpdateFunction);
  })

  const myUpdateFunction = (event) => {
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById('textarea').value = code;
  }
  

</script>

<main>
	
  <div id="blocklyDiv" style="height: 480px; width: 600px;"></div>
  <textarea id="textarea"></textarea>

</main>  

