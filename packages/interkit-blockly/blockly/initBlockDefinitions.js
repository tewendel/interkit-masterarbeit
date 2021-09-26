//import { getBlockObjects } from './getBlockObjects.js'

export const initBlockDefinitions = (Blockly, blockObjects, customFields, metadata={}) => {

  const defaultBlockColour = 220;

  // iterate over blockObjects and use js Blockly api to define blocks
  for(let blockObject of blockObjects) {
    Blockly.Blocks[blockObject.name] = { 
      init: function() {

        this.appendDummyInput().appendField("<"+blockObject.name+">");
        
        // setup fields  
        for(let field of blockObject.fields) {
          
          if(field.type == "string") {
            
            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new Blockly.FieldTextInput(field.defaultValue), field.name);

          } else if(field.type == "checkbox") {

            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new Blockly.FieldCheckbox(field.defaultValue), field.name);

          } else if(field.type == "slot") {

            this.appendDummyInput().appendField(field.name)
            this.appendStatementInput(field.name)

          } else if(field.type == "sheetColumn") {

            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new customFields.SheetColumnField(field), field.name);

          } else if(field.type == "sheetId") {

            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new customFields.SheetIdField(field), field.name);

          } else {
            console.log("unsupported blockly field type", field.type);
          }
        }

        // allow block to connect to other blocks top and below
        this.setNextStatement(true)
        this.setPreviousStatement(true)

        // color
        this.setColour(blockObject.colour ? blockObject.colour : defaultBlockColour);
      },
      data: JSON.stringify(metadata) // can be used to add metadata like whether the component is imported from project or from interkit {location: "interkit"}, {location: "."}
    }
  }

}