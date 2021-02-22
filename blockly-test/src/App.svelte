<script>

  import {onMount} from 'svelte'
  import Blockly from 'blockly'

  import './code_generator.js'

  import block_definitions from './block_definitions.json'

  console.log(block_definitions)

  Blockly.defineBlocksWithJsonArray(block_definitions);
  
  let workspace;

  onMount(()=> {
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById("toolbox")
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


<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox">
  <category name="Basis-Komponenten">
    <block type="bottom_menu"></block>
    <block type="dashboard"></block>
    <block type="map"></block>
  </category>
</xml>