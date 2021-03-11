export const initCodeGenerator = (Blockly) => {

  console.log("initCodeGenerator");

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

  Blockly.JavaScript['Map'] = function(block) {
    var statements_components = Blockly.JavaScript.statementToCode(block, 'components');
    var code = '<Map>\n' + statements_components + '\n</Map>\n';  
    return code;
  };

}