export const initCodeGenerator = (Blockly) => {

  console.log("initCodeGenerator");

  Blockly.JavaScript['sheetColumn'] = function(block) {
    var value = block.getFieldValue('sheetColumn');
    return value;
  };

  Blockly.JavaScript['dashboard'] = function(block) {
    var text_sectiontitles = block.getFieldValue('sectionTitles');
    var text_sectionrefs = block.getFieldValue('sectionRefs');
    // TODO: Assemble JavaScript into code variable.
    let code = `<Dashboard 
      sectionTitles="${text_sectiontitles}"
      sectionRefs="${text_sectionrefs}"
      />`
    return code;
  };

  Blockly.JavaScript['archive'] = function(block) {
    var text_datasheet = block.getFieldValue('dataSheet');
    var text_categorysheet1 = block.getFieldValue('categorySheet1');
    var text_categorysheet2 = block.getFieldValue('categorySheet2');
    
    let code = `<Archive 
      dataSheet="${text_datasheet}"
      categorySheet1="${text_categorysheet1}"
      categorySheet2="${text_categorysheet2}"
      />`
    return code;
  };

  Blockly.JavaScript['Map'] = function(block) {
    
    var text_markerpositions = block.getFieldValue('markerPositions');
    var text_markerlabels = block.getFieldValue('markerLabels');
    
    let code = `<Map 
      markerPositions="${text_markerpositions}"
      markerLabels="${text_markerlabels}"
      />`

    return code;
  };

  Blockly.JavaScript['Style'] = function(block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    var colour_primary_color = block.getFieldValue('primary_color');
    var text_font_family = block.getFieldValue('font_family');
    var text_google_font = block.getFieldValue('google_font');
    
    let code = `<Style 
      primary_color="${colour_primary_color}"
      font_family="${text_font_family}"
      google_font="${text_google_font}"
      />\n${statements_name}\n</Style>`

    return code;
  };

  Blockly.JavaScript['BottomMenu'] = function(block) {
    var statements_pages = Blockly.JavaScript.statementToCode(block, 'pages');
    var statements_buttons = Blockly.JavaScript.statementToCode(block, 'buttons');
    
    let code = `
      <BottomMenu>
        <div slot="pages">
          ${statements_pages}
        </div>
        <div slot="buttons">
          ${statements_buttons}
        </div>
        
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

  Blockly.JavaScript['Dashboard'] = function(block) {
    var statements_components = Blockly.JavaScript.statementToCode(block, 'components');
    var colour_color = block.getFieldValue('color');
    var code = `<Dashboard color="${colour_color}">` + statements_components + '\n</Dashboard>\n';  

    return code;
  };

}