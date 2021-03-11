<script>

  import {onMount} from 'svelte'
  
  import Blockly from 'blockly'
  import { blocklyConfig, InterkitClient } from 'interkit'
  import { BundleServer } from './BundleServer.js'

  export let open;
  export let projectId;
  
  blocklyConfig.initCodeGenerator(Blockly);

  Blockly.defineBlocksWithJsonArray(blocklyConfig.definitions);
  
  let workspace;
  let blocklyXMLFile = "blocklyState.xml";
  let generatedCode = "";

  const initBlockly = async () => {
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
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    
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

<style>
  textarea {
    width: 100%;
    height: 150px;
  }
</style>