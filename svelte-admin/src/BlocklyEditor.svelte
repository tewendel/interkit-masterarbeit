<script>

  import {onMount, onDestroy} from 'svelte'
  import indent from 'xml-formatter';
  
  import { Tabs, Tab, TabContent, Button } from "carbon-components-svelte";
  import DataCheck from "carbon-icons-svelte/lib/DataCheck.svelte";

  import MainColumns from './MainColumns.svelte'
  
  import { watchResize } from "svelte-watch-resize";


  import Blockly from 'blockly';
  import {javascriptGenerator} from 'blockly/javascript';
  import { blocklyConfig } from 'interkit-blockly'
  import parseBlocklyXML from './parseBlocklyXML.js';

  import BlocklyComponentPicker from './BlocklyComponentPicker.svelte';
  
  import { InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  import initSheetColumnField from 'interkit-blockly/blockly/sheetColumnField.js'
  import initSheetIdField from 'interkit-blockly/blockly/sheetIdField.js'
  import initExtraPropsField from 'interkit-blockly/blockly/extraPropsField.js'
  
  import InputModal from './InputModals/InputModal.svelte';
  import CodeHighlighter from './CodeHighlighter.svelte';
  import ActionsEditor from './ActionsEditor.svelte';

  export let open;
  export let projectId;

  // let CustomFields = {}; // save blockly custom fields here
  
  let workspace;
  let toolbox;
  let blocklyXMLFile = "blocklyState.xml";
  let blocklyJsonFile = "blocklyState.json";
  let generatedCode = "";
  
  let openInputModal = null; // which input modal to show
  let inputModalValue; // the current value of the modal
  let submitInputModal; // what happens on submit
  let cancelInputModal; // what happens on cancel
  let inputModalParams; // parameters for the modal

  const updateSheetColumn = (previousValue, notice) => {
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

  // passed into ExtraPropsField, activated when user clicks on it -> showEditor_()
  const updateExtraProps = (currentProps, notice) => {
    inputModalValue = currentProps; // this is bound to inputModal
    inputModalParams = { notice }
    openInputModal = "extraProps";
    console.log("loading Modal for extraProps", inputModalValue)

    // returns Promise so that modal stays open until user clicks something
    return new Promise((resolve, reject) => {
        submitInputModal = () => {
          console.log("submitInputModal", inputModalValue)
          resolve(inputModalValue);
          setTimeout(myUpdateFunction, 100);
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
      SheetIdField: initSheetIdField(Blockly, updateSheetId),
      ExtraPropsField: initExtraPropsField(Blockly, updateExtraProps)    
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

    toolbox = blocklyConfig.getToolbox(Blockly, blockObjects), // generates toolbox from yaml component files

    workspace = Blockly.inject('blocklyDiv', {
      //toolbox,
      trashcan: false,
      move: {
        scrollbars: {
          horizontal: true,
          vertical: true
        },
        drag: true,
        wheel: false
      },
      zoom: {
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

    blocklyConfig.initCodeGenerator(Blockly, javascriptGenerator, blockObjects, workspace); // generates code generator from yaml component files
    
    // hide toolbox
    //workspace.getToolbox().setVisible(false);
  }

  
  const createDatabase = () => {

    // todo: update to json parsing
    let xml = Blockly.Xml.workspaceToDom(workspace);
    let xml_text = Blockly.Xml.domToPrettyText(xml);
    parseBlocklyXML(xml_text, projectId);
  }

  const myUpdateFunction = async (event) => {
    console.log("myUpdateFunction")
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
    imports += `import { t, translations, lang } from 'interkit/i18n.js';\n`
    imports += `$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });\n`
    imports += `console.log('AppBase i18n', { t, $translations, translations, $lang, lang });\n`
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

  onMount(async () => {
    console.log("blockly onMount")
      initBlockly();
  });

  onDestroy(() => {
    console.log("blockly onDestroy")
    if (workspace) {
      workspace.dispose();
    }
  });

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
    console.log("JSON blockly:", jsonString)
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
    console.log("resize")
    if(workspace)
      Blockly.svgResize(workspace);
  }

  let selectedTab;

</script>

  <MainColumns
    sidebarLeftLabel="Components"
    >

    <svelte:fragment slot="sidebarLeft">
      <BlocklyComponentPicker {workspace} {toolbox}/>
    </svelte:fragment>
   
    <svelte:fragment slot="contentMain">
      <div class="__BlocklyEditor">

        <div class="main-buttons">
          <Button on:click={createDatabase} iconDescription="Check Database" kind="ghost" icon={DataCheck}/>
          <Button on:click={()=>saveAndCompile(true)}>save</Button>            
        </div>
      
        <Tabs bind:selected={selectedTab}>
            <Tab label="blockly" />
            <Tab label="App.svelte" />
            <Tab label="actions.js" />
              <div slot="content" class="content">
                <TabContent>
                  <div class="blocklyTabContent">
                    <div id="blocklyDiv" use:watchResize={resizeBlockly}></div>
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

      </div>  
    </svelte:fragment>
  </MainColumns>

  <InputModal
    type={openInputModal}
    bind:value={inputModalValue}
    submit={()=>{submitInputModal()}}
    close={()=>{openInputModal = null; cancelInputModal()}}
    params={inputModalParams}
    {projectId}
  />

<style>

.blocklyTabContent, .__BlocklyEditor, :global(.__BlocklyEditor .bx--tab-content) {
    height: 100%;
  }

  .content {
    height: calc(100% - 40px);
  }

  .main-buttons {
    float: right;
    z-index: 1000;
    position:relative;
  }

  #blocklyDiv {
    width: 100%;
    height: 100%;
  }

  .scroll {
    overflow-y: auto;
  }

</style>
