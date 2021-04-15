export const initCodeGenerator = (Blockly) => {

  /* helper functions */
  const attribute = (block, attributeName, blocklyAttributeName) => {
    if(!blocklyAttributeName) blocklyAttributeName = attributeName;
    
    // if fieldValue is an object with value attribute, use that (eg special field sheetColumn)
    // otherwise use fieldValue directly (eg vanilla string field)
    var value = block.getFieldValue(blocklyAttributeName)?.value ?
      block.getFieldValue(blocklyAttributeName)?.value
      : block.getFieldValue(blocklyAttributeName)

    if(value == "undefined" || value == "null") value = null;

    return value ? `${attributeName}="${value}"\n` : "";
  }

  const attributes = (block, attributeNames) => {
    return attributeNames.map(a => attribute(block, a)).join(" ")
  }

  const slot = (block, slotName, slotProp) => {
    var value = Blockly.JavaScript.statementToCode(block, slotName)
    return value ? 
        (`<svelte:fragment slot="${slotName}" `
        + (slotProp ? `let:${slotProp}={${slotProp}} >` : '>')
        + `\n${value}\n
        </svelte:fragment>\n`) : "";
  }

  const statements = (block, blocklyAttributeName) => {
    var statements_name = Blockly.JavaScript.statementToCode(block, blocklyAttributeName);    
    return `${statements_name}`  
  }
  

  /* code generators for each block */
  console.log("initCodeGenerator");

  Blockly.JavaScript['AppBase'] = function (block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    let code = `<AppBase
      sectionTitles="${text_sectiontitles}"
      sectionRefs="${text_sectionrefs}"
      >\n${statements_name}\n</AppBase>`
    return code;
  };

  Blockly.JavaScript['Dashboard'] = function(block) {
    var code = "<Dashboard \n"
    code += attributes(block, [
      "sectionTitles", 
      "sectionRefs",
      "sectionCategoryRef",
      "sectionTypes",
      "elementTitleColumn",
      "elementDescriptionColumn",      
      "elementAudioColumn",
      "elementImageColumn",
      "categoryTitleColumn",
      "categoryDescriptionColumn",
      "categoryImageColumn"
      ])
    code += " />\n"
    return code;
  };

  Blockly.JavaScript['Tab'] = function(block) {
    var text_label = block.getFieldValue('label');
    return `<Tab label="${text_label}"/>`
  };

  Blockly.JavaScript['TabPanel'] = function(block) {
    
    var code = "<TabPanel>";
    code += statements(block, "default");
    code += "</TabPanel>"
    return code;
  };

  Blockly.JavaScript['Tabs'] = function(block) {
    
    var code = "<Tabs>\n";
    code += slot(block, "tabList") 
    code += slot(block, "tabPanels") 
    code += "</Tabs>"
    return code;
  };


  Blockly.JavaScript['ListNav'] = function(block) {
    
    var code = "<ListNav>\n";
    code += slot(block, "listView") 
    code += slot(block, "singleView") 
    code += "</ListNav>"
    return code;
  };

  
  Blockly.JavaScript['CategoryList'] = function(block) {
    
    var code = "<CategoryList \n";
    code += attribute(block, "categorySheetId")
    code += attribute(block, "nameKey")
    code += attribute(block, "imageKey")
    code += attribute(block, "descriptionKey")
    code += "/>\n"
    return code;
  };

  Blockly.JavaScript['ElementList'] = function(block) {
    
    var code = "<ElementList \n";
    code += attribute(block, "dataSheetId", "dataSheet")
    code += ">\n"
    code += slot(block, "contentElement", "element") 
    code += "</ElementList>"
    return code;
  };

  Blockly.JavaScript['Map'] = function(block) {

    let code = "<Map \n"
    code += attribute(block, "markerPositions");
    code += attribute(block, "markerLabels");
    code += attribute(block, "audioColumn", "audio");   
    code += "/>\n";

    return code;
  };

  Blockly.JavaScript['Styling'] = function(block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    var colour_primary_color = block.getFieldValue('primary_color');
    var text_font_family = block.getFieldValue('font_family');
    var text_google_font = block.getFieldValue('google_font');
    
    let code = `<Styling 
      primary_color="${colour_primary_color}"
      font_family="${text_font_family}"
      google_font="${text_google_font}"
      >\n${statements_name}\n</Styling>`

    return code;
  };

  Blockly.JavaScript['BottomMenu'] = function(block) {
    var statements_pages = Blockly.JavaScript.statementToCode(block, 'pages');
    var statements_buttons = Blockly.JavaScript.statementToCode(block, 'buttons');
    var statements_media_player = Blockly.JavaScript.statementToCode(block, 'media_player');
    
    let code = `
      <BottomMenu>
        <svelte:fragment slot="pages">
          ${statements_pages}
        </svelte:fragment>
        <svelte:fragment slot="media_player">
          ${statements_media_player}
        </svelte:fragment>
        <svelte:fragment slot="buttons">
          ${statements_buttons}
        </svelte:fragment>
        
      </BottomMenu>
    `
    return code;
  };
  
  Blockly.JavaScript['BottomMenuPage'] = function(block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');    
    return `<BottomMenuPage>${statements_name}</BottomMenuPage>`
  };

  Blockly.JavaScript['BottomMenuButton'] = function(block) {
    var text_label = block.getFieldValue('label');
    return `<BottomMenuButton label="${text_label}"/>`
  };

  Blockly.JavaScript['HeadlinePage'] = function(block) {
    var text_label = block.getFieldValue('NAME');
    return `<HeadlinePage headline="${text_label}"/>`
  };

  Blockly.JavaScript['ContentElementAudio'] = function(block) {

    var code = "<ContentElementAudio {element} \n";
    code += attribute(block, "nameColumn", "name")
    code += attribute(block, "audioColumn", "audio")
    code += "\n/>"

    return code;
  };

  Blockly.JavaScript['AudioPlayer'] = function(block) {
    var text_label = block.getFieldValue('NAME');
    return `<AudioPlayer/>`
  };


  
  
}