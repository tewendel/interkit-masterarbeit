export const initCodeGenerator = (Blockly) => {

  console.log("initCodeGenerator");

  Blockly.JavaScript['bottom_menu'] = function(block) {
    var statements_components = Blockly.JavaScript.statementToCode(block, 'components');
    // TODO: Assemble JavaScript into code variable.
    var code = '<Menu>\n' + statements_components + '\n</Menu>\n';  
    return code;
  };

  Blockly.JavaScript['dashboard'] = function(block) {
    var statements_components = Blockly.JavaScript.statementToCode(block, 'components');
    // TODO: Assemble JavaScript into code variable.

    var colour_color = block.getFieldValue('color');

    var code = `<Dashboard color="${colour_color}">` + statements_components + '\n</Dashboard>\n';  

    return code;
  };

  Blockly.JavaScript['map'] = function(block) {
    var statements_components = Blockly.JavaScript.statementToCode(block, 'components');
    // TODO: Assemble JavaScript into code variable.
    var code = '<Map>\n' + statements_components + '\n</Map>\n';  
    return code;
  };

}