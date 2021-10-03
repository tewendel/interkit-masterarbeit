<script>

  import {onMount} from 'svelte'
  import indent from 'xml-formatter';
  
  import { Tabs, Tab, TabContent, Button } from "carbon-components-svelte";
  import { watchResize } from "svelte-watch-resize";

  
  import Blockly from 'blockly';
  import { blocklyConfig } from 'interkit-blockly'
  import parseBlocklyXML from './parseBlocklyXML.js';
  
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  import initSheetColumnField from 'interkit-blockly/blockly/sheetColumnField.js'
  import initSheetIdField from 'interkit-blockly/blockly/sheetIdField.js'
  
  import InputModal from './InputModals/InputModal.svelte';
  import CodeHighlighter from './CodeHighlighter.svelte';

  export let open;
  export let projectId;

  // let CustomFields = {}; // save blockly custom fields here
  
  let workspace;
  let blocklyXMLFile = "blocklyState.xml";
  let blocklyXML;
  let generatedCode = "";
  
  let openInputModal = null;
  let inputModalValue;
  let submitInputModal;
  let cancelInputModal;
  let inputModalParams;

  const updateSheetColumn = (previousValue, notice) => {
    console.log("notice", notice, previousValue)

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
            text: inputModalValue.text,
            fieldType: inputModalValue.fieldType
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
      sheetKey: previousValue?.value
    };
    inputModalParams = { notice }
    openInputModal = "sheetId";
    console.log("updateSheetId", inputModalValue)

    return new Promise((resolve, reject) => {
        submitInputModal = () => {
          console.log("submitInputModal", inputModalValue)
          let value = ""
          if(inputModalValue.sheetKey && inputModalValue.sheetKey != "empty") {
            value = inputModalValue.sheetKey;
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

    const customFields = {
      SheetColumnField: initSheetColumnField(Blockly, updateSheetColumn),
      SheetIdField: initSheetIdField(Blockly, updateSheetId)    
    }


    let blockData = await BundleServer.loadBlockData(projectId);
    console.log("loaded block info from app bundler", blockData)
    if(blockData.errors.length) {
      alert("error loading block data" + blockData.errors.reduce( (result, entry)=> result + "\n\n" + entry.errorMessage, ""))
      console.log(blockData)
    }
    let blockObjects = blockData.components.map(e => ({
      ...e.json, 
      origin: e.origin 
    }));

    blocklyConfig.initBlockDefinitions(Blockly, blockObjects, customFields); // generates block definitions from yaml component files
    
    console.log("Blocks", Blockly.Blocks)

    //console.log(blocklyConfig.toolbox)

    workspace = Blockly.inject('blocklyDiv', {
      toolbox: blocklyConfig.getToolbox(Blockly, blockObjects), // generates toolbox from yaml component files
      zoom:
        {
          controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true
        },
    });

    //console.log(workspace)

    workspace.addChangeListener(myUpdateFunction);

    blocklyXML = await InterkitClient.call("file.load", {filename: blocklyXMLFile, projectId})  
    if(blocklyXML.content) {
      //console.log("blocklyXML", blocklyXML.content)
      let xml = Blockly.Xml.textToDom(blocklyXML.content);
      try {
        Blockly.Xml.domToWorkspace(xml, workspace);
      } catch(e) {
        alert("error importing blockly xml")
      }
    }

    blocklyConfig.initCodeGenerator(Blockly, blockObjects); // generates code generator from yaml component files
    
  }

  const createDatabase = () => {

    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xml_text = Blockly.Xml.domToPrettyText(xml);
    parseBlocklyXML(xml_text, projectId);
  }

  const myUpdateFunction = async (event) => {
    //console.log("myUpdateFunction")
    let code;
    try {
      code = Blockly.JavaScript.workspaceToCode(workspace);
    } catch(e) {
      console.log(e)
    }
    
    // add import statements
    let allBlocks = workspace.getAllBlocks()
    let allBlocksUnique = allBlocks.filter((e, i) => allBlocks.findIndex(b => b.type === e.type) === i)

    let imports = "<script>\n";
    //imports += `import AppBase from "interkit/components/AppBase.svelte";\n`
    imports += `import initActions from "./actions.js"; \ninitActions(); \n`
    for(let block of allBlocksUnique) {
      let origin = "interkit"
      try {
        const data = block.data ? JSON.parse(block.data) : {}
        if (data.origin) origin = data.origin
      } catch {}
      if(block.type != "BlocklySubTree" && block.type != "SubtreeReference")
        imports += `import ${block.type} from "${origin}/components/${block.type}.svelte";\n`
    }
    imports += "</"+"script>\n\n" // writing this as two strings to escape svelte compiler

    // let codeWithAppBase = "<AppBase>\n" + code + "\n</AppBase>";
    generatedCode = imports + code;
    
  }

  $: {
    //console.log("blockly open", open)
    if(open && !workspace) {
      initBlockly();      
    }
  }

  const save = async ()=>{

    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xml_text = Blockly.Xml.domToPrettyText(xml);
    blocklyXML = {content: xml_text}

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

  const saveAndCompile = async (dev=false)=>{

    await save();
    BundleServer.compileReloadPreview(dev);
    
  }

  const resizeBlockly = (node) => {
    //console.log("resize")
    if(workspace)
      Blockly.svgResize(workspace);
  }


</script>


  <Tabs>
      <Tab label="blockly" />
      <Tab label="App.svelte" />
        <div slot="content">
          <TabContent>
              <div id="blocklyDiv" style="height: 500px; width: 100%;" use:watchResize={resizeBlockly}></div>
          </TabContent>
          <TabContent>
            <CodeHighlighter code={generatedCode} />
          </TabContent>
      </div>
  </Tabs>




  <Button on:click={()=>saveAndCompile(true)}>save</Button>
  <br />
  <br />
  <Button on:click={createDatabase} size="small" kind="tertiary">check database</Button>
  
  <InputModal
    type={openInputModal}
    bind:value={inputModalValue}
    submit={()=>{submitInputModal()}}
    close={()=>{openInputModal = null; cancelInputModal()}}
    params={inputModalParams}
    {projectId}
  />

<style>
</style>