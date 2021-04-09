export const initCodeGenerator = (Blockly) => {

  /* helper functions */
  const attribute = (block, attributeName, blocklyAttributeName) => {
    if(!blocklyAttributeName) blocklyAttributeName = attributeName;
    var value = block.getFieldValue(blocklyAttributeName)?.value

    if(value == "undefined" || value == "null") value = null;

    return value ? `${attributeName}="${value}"\n` : "";
  }

  const slot = (block, slotName, slotProp) => {
    var value = Blockly.JavaScript.statementToCode(block, slotName)
    return value ? 
        (`<svelte:fragment slot="${slotName}" `
        + (slotProp ? `let:${slotProp}={${slotProp}} >` : '>')
        + `\n${value}\n
        </svelte:fragment>\n`) : "";
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
    var text_sectiontitles = block.getFieldValue('sectionTitles')?.value;
    var text_sectionrefs = block.getFieldValue('sectionRefs')?.value;
    // TODO: Assemble JavaScript into code variable.
    var code = `<Dashboard 
      sectionTitles="${text_sectiontitles}"
      sectionRefs="${text_sectionrefs}"
      />`
    return code;
  };

  
  Blockly.JavaScript['Archive'] = function(block) {
    
    var code = "<Archive \n";
    code += attribute(block, "dataSheet")
    code += attribute(block, "categorySheet1")
    code += attribute(block, "categorySheet2")
    code += ">\n"
    code += "</Archive>"
    return code;
  };

  Blockly.JavaScript['ArchiveList'] = function(block) {
    
    var code = "<ArchiveList \n";
    code += attribute(block, "dataSheetId", "dataSheet")
    code += ">\n"
    code += slot(block, "contentElement", "element") 
    code += "</ArchiveList>"
    return code;
  };

  Blockly.JavaScript['Map'] = function(block) {

    //console.log("test", block.getFieldValue('markerPositions'))
    
    var text_markerpositions = block.getFieldValue('markerPositions')?.value;
    var text_markerlabels = block.getFieldValue('markerLabels')?.value;
    
    let code = `<Map 
      markerPositions="${text_markerpositions}"
      markerLabels="${text_markerlabels}"
      />`

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