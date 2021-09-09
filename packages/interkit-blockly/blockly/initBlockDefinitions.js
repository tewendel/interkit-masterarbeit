import { getBlockObjects } from './getBlockObjects.js'

export const initBlockDefinitions = (Blockly) => {

  const blockObjects = getBlockObjects();

  // iterate over blockObjects and use js Blockly api to define blocks
  for(let blockObject of blockObjects) {
    Blockly.Blocks[blockObject.name] = { 
      init: function() {
        for(let field of blockObject.fields) {
          if(field.type == "string") {
            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new Blockly.FieldTextInput(field.defaultValue), field.name);
            
          } else {
            console.log("unsupported blockly field type", field.type);
          }
        }
        
        this.setColour(blockObject.color);
      }
    }
  }

}