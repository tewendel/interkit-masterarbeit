<script>

  import {onMount} from 'svelte'

  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  
  import Blockly from 'blockly';
  import { blocklyConfig } from 'interkit-dev'
  
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  import initSheetColumnField from 'interkit-dev/blockly/sheetColumnField.js'
  import initSheetIdField from 'interkit-dev/blockly/sheetIdField.js'
  
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
  let inputModalParams;

  const updateSheetColumn = (previousValue, notice) => {
    console.log("notice", notice)
    inputModalValue = {
      sheetKey: previousValue?.value?.split("/")[0], 
      columnKey: previousValue?.value?.split("/")[1]
    };
    inputModalParams = { notice }
    openInputModal = "sheetColumn";
    console.log("updateSheetColumn", inputModalValue)

    return new Promise((resolve, reject) => {
        submitInputModal = () => {
          console.log("submitInputModal", inputModalValue)
          let value = ""
          if(inputModalValue.sheetKey && inputModalValue.sheetKey != "empty" && inputModalValue.columnKey && inputModalValue.columnKey != "empty") {
            value = inputModalValue.sheetKey + "/" + inputModalValue.columnKey; 
          }
          resolve({
            value, 
            text: inputModalValue.text
          });  
        }
        cancelInputModal = () => {
          reject("cancelled")
        }  
    });
  }

  const updateSheetId = (previousValue, notice) => {
    console.log("notice", notice)
    inputModalValue = {
      sheetId: previousValue?.value
    };
    inputModalParams = { notice }
    openInputModal = "sheetId";
    console.log("updateSheetId", inputModalValue)

    return new Promise((resolve, reject) => {
        submitInputModal = () => {
          console.log("submitInputModal", inputModalValue)
          let value = ""
          if(inputModalValue.sheetId && inputModalValue.sheetId != "empty") {
            value = inputModalValue.sheetId;
          }
          resolve({
            value, 
            text: inputModalValue.text
          });  
        }
        cancelInputModal = () => {
          reject("cancelled")
        }  
    });
  }

  const initBlockly = async () => {

    console.log("initBlockly")

    const CustomFields1 = initSheetColumnField(Blockly, updateSheetColumn);
    const CustomFields2 = initSheetIdField(Blockly, updateSheetId);
    
    blocklyConfig.initCodeGenerator(Blockly);
    
    Blockly.defineBlocksWithJsonArray(blocklyConfig.definitions);
    
    workspace = Blockly.inject('blocklyDiv', {
      toolbox: blocklyConfig.toolbox
    });
    workspace.addChangeListener(myUpdateFunction);

    let blocklyXML = await InterkitClient.call("file.load", {filename: blocklyXMLFile, projectId})  
    if(blocklyXML.content) {
      console.log(blocklyXML.content)
      let xml = Blockly.Xml.textToDom(blocklyXML.content);
      try {
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch(e) {
        alert("error importing blockly xml")
      }
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
    imports += `import AppBase from "interkit/components/AppBase.svelte";\n`
    for(let type of allBlocksUnique) {
      imports += `import ${type} from "interkit/components/${type}.svelte";\n`
    }
    imports += "</"+"script>\n\n" // writing this as two strings to escape svelte compiler

    generatedCode = imports + "<AppBase>\n" + code + "\n</AppBase>";

    document.getElementById('textarea').value = generatedCode;
  }

  $: {
    console.log("blockly open", open)
    if(open && !workspace) {
      initBlockly();      
      myUpdateFunction();
    }
  }

  const save = async ()=>{

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
  }

  const saveAndCompile = async ()=>{

    await save();
    BundleServer.compileReloadPreview();
    
  }


</script>

  <Tabs>
      <Tab label="blockly" />
      <Tab label="App.svelte" />
    <div slot="content">
      <TabContent>
          <div id="blocklyDiv" style="height: 500px; width: 100%;"></div>
      </TabContent>
      <TabContent>
          <textarea id="textarea"></textarea>
      </TabContent>
      
    </div>
  </Tabs>




  <button on:click={save}>save</button>
  <button on:click={saveAndCompile}>save & compile</button>
  
  <InputModal
    type={openInputModal}
    bind:value={inputModalValue}
    submit={()=>{submitInputModal()}}
    close={()=>{openInputModal = null; cancelInputModal()}}
    params={inputModalParams}
    {projectId}
  />

<style>
  textarea {
    width: 100%;
    height: 500px;
  }
</style>