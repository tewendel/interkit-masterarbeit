<script>

  import {onMount, onDestroy} from 'svelte'
  import indent from 'xml-formatter';
  
  import { Tabs, Tab, TabContent, Button, ButtonSet } from "carbon-components-svelte";
  import DataCheck from "carbon-icons-svelte/lib/DataCheck.svelte";
  import Rotate from "carbon-icons-svelte/lib/Rotate.svelte"
  import Undo from "carbon-icons-svelte/lib/Undo.svelte"
  import Help from "carbon-icons-svelte/lib/Help.svelte";

  import MainColumns from '../Layout/MainColumns.svelte'
  
  import { watchResize } from "svelte-watch-resize";

  import { currentProjectReadOnly } from '../admin';

  import Blockly from 'blockly';
  import {javascriptGenerator} from 'blockly/javascript';
  import { blocklyConfig } from 'interkit-blockly'
  
  import BlocklyComponentPicker from './BlocklyComponentPicker.svelte';
  import BlocklyQuickNav from './BlocklyQuickNav.svelte';
  
  import { InterkitClient } from 'interkit'
  import { BundleServer } from '../BundleServer.js'
  import { docsGo } from '../docs.js'

  import initSheetColumnField from 'interkit-blockly/blockly/sheetColumnField.js'
  import initSheetIdField from 'interkit-blockly/blockly/sheetIdField.js'
  import initExtraPropsField from 'interkit-blockly/blockly/extraPropsField.js'
  
  import InputModal from '../InputModals/InputModal.svelte';
  import CodeHighlighter from '../Atoms/CodeHighlighter.svelte';
  import ActionsEditor from './ActionsEditor.svelte';

  export let open;
  export let projectId;

  // let CustomFields = {}; // save blockly custom fields here
  
  let workspace;
  let topBlocks = [];
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
  const updateExtraProps = (currentProps, notice, blockName) => {
    inputModalValue = currentProps; // this is bound to inputModal
    inputModalParams = { notice, blockName }
    openInputModal = "extraProps";
    //console.log("loading Modal for extraProps", inputModalValue)

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

  let blockObjects; // the block definitions from the yaml files

  // recursively traverses blockly json and writes fixed state to correctedBlocklyState
  const checkBlocklyJson = (jsonObj) => {
    console.log("checkBlocklyJson:", jsonObj)
    let correctedBlocklyState = {...jsonObj, blocks: {...jsonObj.blocks, blocks:[]}}

    const checkSingleBlock = (obj) => {
      const blockType = obj?.type;
      //console.log("checkSingleBlock", blockType, obj)
      if(!Object.keys(Blockly.Blocks).includes(blockType)) {
        alert(`Component compatibilty issue: This project contains the component "${blockType}", which is not available in the current interkit version. Components of type "${blockType}", as well as children and attached blocks have been removed.`)
        return false;
      }

      // copy block with no next and no inputs
      let correctedBlock = {...obj, next: {}, inputs: {}}

      // check if there is a next block and add it if it passes the test
      if(obj?.next?.block) {
        let checkedBlock = checkSingleBlock(obj?.next?.block)
        if(checkedBlock) {
          correctedBlock.next.block = checkedBlock;
        }
      }
      
      // check if there are inputs, only add those that pass the test
      if(obj?.inputs) {
        for(let entry in obj?.inputs) {
          let checkedBlock = checkSingleBlock(obj?.inputs?.[entry]?.block)
          if(checkedBlock) {
            correctedBlock.inputs[entry] = {block: checkedBlock};
          }
        }
      }
      return correctedBlock;
    }
    // starts by going over blocks array
    for(let block of jsonObj?.blocks?.blocks) {
      let checkedBlock = checkSingleBlock(block)
      if(checkedBlock) {
        correctedBlocklyState.blocks.blocks.push(checkedBlock)
      }
    }    
    console.log("correctedBlocklyState", correctedBlocklyState)
    return correctedBlocklyState;
  }

  const loadBlocklyData = async () => {
    console.log("loadBlocklyData")

    let blocklyJson = await BundleServer.loadSrcFile({filename: blocklyJsonFile, projectId});
    if(blocklyJson?.content) {
      try {
        let stateToLoad = JSON.parse(blocklyJson.content)
        console.log("blockly stateToLoad", stateToLoad)
        let correctedBlocklyState = checkBlocklyJson(stateToLoad);
        Blockly.serialization.workspaces.load(correctedBlocklyState, workspace)
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
    blockObjects = blockData.components.map(e => ({
      ...e.json, 
      origin: e.origin 
    }));

    blocklyConfig.initBlockDefinitions(Blockly, blockObjects, customFields, docsGo); // generates block definitions from yaml component files
    
    console.log("Blocks", Object.keys(Blockly.Blocks))

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

    await loadBlocklyData()

    blocklyConfig.initCodeGenerator(Blockly, javascriptGenerator, blockObjects, workspace); // generates code generator from yaml component files
    
    // hide toolbox
    //workspace.getToolbox().setVisible(false);
  }

  
  const createDatabase = () => {
    checkDatabaseFromBlockly(workspace, projectId)
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
    imports += `import initActions from "./actions.js";\n`
    imports += `import { t, translations, lang } from 'interkit/i18n.js';\n`
    for(let block of allBlocksUnique.sort( (a,b) => a.type.localeCompare(b.type, 'en') )) {
      let origin = "interkit"
      try {
        const data = block.data ? JSON.parse(block.data) : {}
        if (data.origin) origin = data.origin
      } catch {}
      if(!["Group", "GroupConnector", "RouteConnector"].includes(block.type))
        imports += `import ${block.type} from "${origin}/components/${block.type}.svelte";\n`
    }
    imports += `import styleTokens from "./styleTokens.json";\n`
    imports += `globalThis.styleTokens = styleTokens;\n`
    imports += `console.log('AppBase styleTokens', styleTokens);\n`
    imports += `initActions();\n`
    imports += `$: $translations, translations, t, $lang, lang, console.log('AppBase i18n $', { t, $translations, translations, $lang, lang });\n`
    imports += `console.log('AppBase i18n', { t, $translations, translations, $lang, lang });\n`
    imports += "</"+"script>\n\n" // writing this as two strings to escape svelte compiler

    // let codeWithAppBase = "<AppBase>\n" + code + "\n</AppBase>";
    generatedCode = imports + code;
    
    topBlocks = workspace.getTopBlocks();
  }

  let blocklyDragTarget
  let blocklyDragHelperEl

  onMount(async () => {
    console.log("blockly onMount")
    initBlockly(); // run init onMount 
    blocklyDragHelperEl = document.getElementById('blocklyDragHelper') || document.createElement('div')
    blocklyDragHelperEl.id = 'blocklyDragHelper'
    document.body.appendChild(blocklyDragHelperEl)
  });

  onDestroy(() => {
    console.log("blockly onDestroy")
    if (workspace) {
      workspace.dispose();
    }
  });

  /*
    // run init when projectId changes 
    // currently disabled to reduce complexity
    // the whole component is reloaded using #key in ProjectWorkspace
    const updateProjectId = (projectId) => {
    console.log("updateProjectId")
    if (workspace) {
      workspace.dispose()
    }
    selectedTab = 0
    initBlockly()
  }

  $: {
    console.log("BlocklyEditor projectId changed", projectId)
    updateProjectId()
  }*/

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
    //console.log("JSON blockly:", jsonString)
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

  /* Hack to avoid active blockly input etc. hovering above other tabs.
   * See root App.svelte style and Layout/TopTabs */
  $: document.body.classList.toggle('appBlocklyTabActive', selectedTab === 0)

  function onKeyDown(e) {
    if (!open) return
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      saveAndCompile(true)
    }
  }

  let dragging = false

  const getBlocklyMouse2WorkspaceCoords = evt => {
    const rect = evt.target.getBoundingClientRect()
    const relMouseX = evt.clientX - rect.left
    const relMouseY = evt.clientY - rect.top
    const normX = relMouseX / rect.width
    const normY = relMouseY / rect.height
    const metrics = workspace.getMetrics()
    const x = metrics.viewLeft / workspace.scale + normX * metrics.viewWidth / workspace.scale
    const y = metrics.viewTop / workspace.scale + normY * metrics.viewHeight / workspace.scale
    return { x, y }
  }

  const addComponent = (blockName, workspacePosition) => {
    console.log('addComponent', blockName)
    if (!workspacePosition) {
      workspacePosition = {
        x: (workspace.getMetrics().viewLeft + 20) / workspace.scale,
        y: (workspace.getMetrics().viewTop + 20) / workspace.scale
      }
    }
    let newBlock = workspace.newBlock(blockName)
    newBlock.initSvg()
    newBlock.moveBy(workspacePosition.x, workspacePosition.y)
    newBlock.render()
  }

  let dragDroppable = false

  const dragMove = evt => {
    blocklyDragHelperEl.style.left = (evt.clientX + 10) + 'px'
    blocklyDragHelperEl.style.top = (evt.clientY + 10) + 'px'
  }

  const startDrag = evt1 => {
    dragging = evt1.detail
    dragMove(evt1) // updates position
    document.body.classList.toggle('blockly--dragging', true)
    blocklyDragHelperEl.textContent = dragging
    evt1.preventDefault()
    evt1.stopPropagation()
    document.addEventListener('mousemove', dragMove, { passive: true })
    document.addEventListener('mouseup', evt2 => {
      document.removeEventListener('mousemove', dragMove, { passive: true })
      blocklyDragHelperEl.style.left = '0'
      blocklyDragHelperEl.style.top = '0'
      if (dragDroppable) {
        addComponent(dragging, getBlocklyMouse2WorkspaceCoords(evt2))
      }
      dragging = false
      document.body.classList.toggle('blockly--dragging', false)
    }, { once: true })
  }

  const resetBlockly = async () => {
    console.log("resetBlockly")
    await loadBlocklyData()
  }

  let activeTab = 0

</script>

  <svelte:window on:keydown={onKeyDown} />

  <MainColumns
    sidebarLeftLabel=""
    >

    <svelte:fragment slot="sidebarLeftTitleSlot">
      <Tabs autoWidth bind:selected={activeTab}>
        <Tab label="Components" />
        <Tab label="Focus" />
      </Tabs>
    </svelte:fragment>

    <svelte:fragment slot="sidebarLeft">
      <div class:displayNone={activeTab != 0}>
        <BlocklyComponentPicker
          {toolbox}
          blockDefinitionsYaml={blockObjects}
          on:startdrag={startDrag}
          on:addcomponent={evt => addComponent(evt.detail)}
        />
      </div>
      <div class:displayNone={activeTab != 1}>
        <BlocklyQuickNav
          {workspace}
          {topBlocks}
        />
      </div>
    </svelte:fragment>
   
    <svelte:fragment slot="contentMain">
      <div class="__BlocklyEditor">

        <div class="main-buttons">
          <!--Button on:click={createDatabase} iconDescription="Check Database" kind="ghost" icon={DataCheck}/-->
          <ButtonSet>
            <!-- size=field matches Tabs in height -->
            <Button
              icon={Help}
              kind="ghost"
              size="field"
              on:click={() => docsGo('/guides/overview/interface_overview#app')}
              >Help</Button>
              {#if selectedTab == 0}
              <Button
                kind="ghost"
                size="small"
                icon={Undo}
                on:click={resetBlockly}
                iconDescription="Back to last save"
                tooltipAlignment="start"
                tooltipPosition="bottom"
                />
              {/if}
              <Button
                size="field"
                on:click={() => saveAndCompile(true)}
                disabled={$currentProjectReadOnly}
                >Save</Button>
          </ButtonSet>
        </div>
      
        <Tabs bind:selected={selectedTab}>
            <Tab label="blockly" />
            <Tab label="App.svelte" />
            <Tab label="actions.js" />
              <div slot="content" class="content">
                <TabContent>
                  <div class="blocklyTabContent">
                    <div class="blocklyWrapper">
                      <div
                        id="blocklyDiv"
                        use:watchResize={resizeBlockly}
                        ></div>
                      <div
                        style={`visibility: ${dragging ? 'visible' : 'hidden'}`}
                        class="blocklyDragTarget"
                        bind:this={blocklyDragTarget}
                        on:mouseenter={() => { dragDroppable = true; document.body.classList.toggle('blockly--droppable', true) }}
                        on:mouseleave={() => { dragDroppable = false; document.body.classList.toggle('blockly--droppable', false) }}
                        ></div>
                    </div>
                  </div>
                </TabContent>
                <TabContent>
                  <!-- FIXME this is too wide and causes weird horizontal scroll -->
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

  .displayNone {
    display: none;
  }

  .blocklyTabContent,
  .__BlocklyEditor,
  :global(.__BlocklyEditor .bx--tab-content) {
    height: 100%;
  }

  .__BlocklyEditor {
    position: relative;
  }

  .content {
    height: calc(100% - 40px);
  }

  .main-buttons {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
  }

  .blocklyWrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .blocklyDragTarget,
  #blocklyDiv {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .blocklyDragTarget {
    border: 2px dashed #888;
  }

  :global(body.blockly--droppable) .blocklyDragTarget {
    border-color: #0f62fe;
  }

  .scroll {
    overflow-y: auto;
    height: 100%;
  }

  @media (max-width: 80rem) {
    /* tiny hack so Tabs blockly/App/actions don't overlap with the top right buttons */
    :global(.__BlocklyEditor .bx--tabs__nav-link) {
      width: auto;
    }
  }

</style>
