<script>

  import {onMount} from 'svelte'
  
  import Blockly from 'blockly';
  import { blocklyConfig } from 'interkit-dev'
  
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  import initSheetColumnField from 'interkit-dev/blockly/sheetColumnField.js'

  import InputModal from './InputModals/InputModal.svelte';

  export let open;
  export let projectId;

  // let CustomFields = {}; // save blockly custom fields here
  
  let workspace;
  let blocklyXMLFile = "blocklyState.xml";
  let generatedCode = "";
  
  let openInputModal = null;
  let inputModalValue;
  let submitInputModal;
  let cancelInputModal;

  const updateSheetColumn = (previousValue) => {
    inputModalValue = {
      sheetId: previousValue?.split("/")[0], 
      columnKey: previousValue?.split("/")[1]
    };
    openInputModal = "sheetColumn";
    console.log("updateSheetColumn", inputModalValue)

    return new Promise((resolve, reject) => {
        submitInputModal = () => {
          console.log("submitInputModal", inputModalValue)
          resolve(inputModalValue.sheetId + "/" + inputModalValue.columnKey);  
        }
        cancelInputModal = () => {
          reject("cancelled")
        }  
    });
  }

  const initBlockly = async () => {

    console.log("initBlockly")

    const CustomFields = initSheetColumnField(Blockly, updateSheetColumn);
    //console.log(CustomFields)
    
    blocklyConfig.initCodeGenerator(Blockly);
    
    /*Blockly.Extensions.register('sheetColumn_extension',
    function() {
      this.appendDummyInput()
        .appendField('sheetColumn')
        .appendField(new CustomFields.SheetColumnField(), 'sheetColumn');
    });*/

    Blockly.defineBlocksWithJsonArray(blocklyConfig.definitions);
    
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: blocklyConfig.toolbox
    });
    workspace.addChangeListener(myUpdateFunction);

    let blocklyXML = await InterkitClient.call("file.load", {filename: blocklyXMLFile, projectId})  
    if(blocklyXML.content) {
      console.log(blocklyXML.content)
      let xml = Blockly.Xml.textToDom(blocklyXML.content);
      Blockly.Xml.domToWorkspace(xml, workspace);
    }


  }

  const myUpdateFunction = (event) => {
    //console.log("myUpdateFunction")
    let code;
    try {
      code = Blockly.JavaScript.workspaceToCode(workspace);
    } catch(e) {
      console.log(e)
    }
    
    // add import statements
    let allBlocks = workspace.getAllBlocks().map(b=>b.type)
    let allBlocksUnique = allBlocks.filter((e, i) => allBlocks.indexOf(e) === i)
    
    let imports = "<script>\n";
    for(let type of allBlocksUnique) {
      imports += `import ${type} from "interkit/components/${type}.svelte";\n`
    }
    imports += "</"+"script>\n\n" // writing this as two strings to escape svelte compiler

    generatedCode = imports + code;

    document.getElementById('textarea').value = generatedCode;
  }

  $: {
    console.log("blockly open", open)
    if(open && !workspace) {
      initBlockly();      
      myUpdateFunction();
    }
  }

  const saveAndCompile = async ()=>{

    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xml_text = Blockly.Xml.domToPrettyText(xml);

    //console.log(xml_text)

    let file = {
      filename: blocklyXMLFile,
      content: xml_text
    }
    await InterkitClient.call("file.save", {file, projectId})

    let appSvelteFile = {
      filename: "App.svelte",
      content: generatedCode
    }

    await InterkitClient.call("file.save", {file: appSvelteFile, projectId})
    BundleServer.compileReloadPreview();
    
  }


</script>

  <div id="blocklyDiv" style="height: 350px; width: 100%;"></div>
  <textarea id="textarea"></textarea>

  <button on:click={saveAndCompile}>save & compile</button>

  <InputModal
    type={openInputModal}
    bind:value={inputModalValue}
    submit={()=>{submitInputModal()}}
    close={()=>{openInputModal = null; cancelInputModal()}}
    {projectId}
  />

<style>
  textarea {
    width: 100%;
    height: 150px;
  }
</style>