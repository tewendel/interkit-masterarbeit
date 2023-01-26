<script>

  import {onMount} from 'svelte'
  import indent from 'xml-formatter';
  
  import { Tabs, Tab, TabContent, Button } from "carbon-components-svelte";
  import { watchResize } from "svelte-watch-resize";

  
  import Blockly from 'blockly';
  import {javascriptGenerator} from 'blockly/javascript';
  import { blocklyConfig } from 'interkit-blockly'
  import parseBlocklyXML from './parseBlocklyXML.js';
  
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  import initSheetColumnField from 'interkit-blockly/blockly/sheetColumnField.js'
  import initSheetIdField from 'interkit-blockly/blockly/sheetIdField.js'
  
  import InputModal from './InputModals/InputModal.svelte';
  import CodeHighlighter from './CodeHighlighter.svelte';
  import ActionsEditor from './ActionsEditor.svelte';

  export let open;
  export let projectId;

  // let CustomFields = {}; // save blockly custom fields here
  
  let workspace;
  let blocklyXMLFile = "blocklyState.xml";
  let blocklyJsonFile = "blocklyState.json";
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

    let blocklyJson = await BundleServer.loadSrcFile({filename: blocklyJsonFile, projectId});
    if(blocklyJson?.content) {
      try {
        let stateToLoad = JSON.parse(blocklyJson.content)
        Blockly.serialization.workspaces.load(stateToLoad, workspace)
      } catch(e) {
        alert("error importing blockly json")
        console.log("json import error", e)
      }
    }

    if(!blocklyJson) {
      let blocklyXML = await BundleServer.loadSrcFile({filename: blocklyXMLFile, projectId});
      if(blocklyXML?.content) {
        //console.log("blocklyXML", blocklyXML.content)
        let xml = Blockly.Xml.textToDom(blocklyXML.content);
        try {
          Blockly.Xml.domToWorkspace(xml, workspace);
        } catch(e) {
          alert("error importing blockly xml")
        }
      }
    }

    blocklyConfig.initCodeGenerator(javascriptGenerator, blockObjects); // generates code generator from yaml component files
    
    // hide toolbox
    /*
    let toolbox = workspace.getToolbox();
    toolbox.setVisible(false);
    */

  }

  /*
  const testBlockly = () => {
    
    // add a new block to the workspace programmatically
    let newBlock = workspace.newBlock('HeadlinePage');
    newBlock.initSvg();
    newBlock.render();
  }
  */

  const createDatabase = () => {

    // todo: update to json parsing
    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xml_text = Blockly.Xml.domToPrettyText(xml);
    parseBlocklyXML(xml_text, projectId);
  }

  const myUpdateFunction = async (event) => {
    //console.log("myUpdateFunction")
    let code;
    try {
      code = javascriptGenerator.workspaceToCode(workspace);
    } catch(e) {
      console.log(e)
    }
    
    // add import statements
    let allBlocks = workspace.getAllBlocks()
    let allBlocksUnique = allBlocks.filter((e, i) => allBlocks.findIndex(b => b.type === e.type) === i)

    let imports = "<script>\n";
    //imports += `import AppBase from "interkit/components/AppBase.svelte";\n`
    imports += `import initActions from "./actions.js"; \ninitActions(); \n`
    imports += `import { t, lang } from 'interkit/i18n.js';\n`
    imports += `$: $t, t, $lang, lang, console.log('AppBase i18n $', { $t, t, $lang, lang });\n`
    imports += `console.log('AppBase i18n', { $t, t, $lang, lang });\n`
    for(let block of allBlocksUnique.sort( (a,b) => a.type.localeCompare(b.type, 'en') )) {
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

    // save xml
    /* deactivated
    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xml_text = Blockly.Xml.domToPrettyText(xml);
    let blocklyXML = {content: xml_text}
    //console.log(xml_text)

    let file = {
      filename: blocklyXMLFile,
      content: xml_text
    }
    await BundleServer.saveSrcFile({file, projectId})    
    */

    // save json
    let jsonString = JSON.stringify(Blockly.serialization.workspaces.save(workspace), null, 2)
    // console.log("JSON blockly:", jsonString)
    let jsonFile = {
      filename: blocklyJsonFile,
      content: jsonString
    }
    await BundleServer.saveSrcFile({file: jsonFile, projectId})    


    let appSvelteFile = {
      filename: "App.svelte",
      content: generatedCode
    }

    await BundleServer.saveSrcFile({file: appSvelteFile, projectId})    
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

  let selectedTab;

</script>

  <Tabs bind:selected={selectedTab}>
      <Tab label="blockly" />
      <Tab label="App.svelte" />
      <Tab label="actions.js" />
        <div slot="content" class="content">
          <TabContent>
            <div class="blocklyTabContent">
              <div id="blocklyDiv"use:watchResize={resizeBlockly}></div>
              <br />
              <Button on:click={()=>saveAndCompile(true)}>save</Button>
              &nbsp;&nbsp;
              <Button on:click={createDatabase} kind="tertiary">check database</Button>
            </div>
          </TabContent>
          <TabContent>
            <div class="scroll">
              <CodeHighlighter code={generatedCode} />
            </div>
          </TabContent>
          <TabContent>
            <ActionsEditor {projectId} active={selectedTab == 2}/>
          </TabContent>
      </div>
  </Tabs>
  
  <InputModal
    type={openInputModal}
    bind:value={inputModalValue}
    submit={()=>{submitInputModal()}}
    close={()=>{openInputModal = null; cancelInputModal()}}
    params={inputModalParams}
    {projectId}
  />

<style>

  .content, .blocklyTabContent {
    height: calc(100vh - 260px);
  }

  #blocklyDiv {
    width: 100%;
    height: calc(100vh - 340px);
  }

  .scroll {
    overflow-y: auto;
  }

</style>
