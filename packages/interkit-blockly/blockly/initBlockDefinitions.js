//import { getBlockObjects } from './getBlockObjects.js'

export const initBlockDefinitions = (Blockly, blockObjects, customFields) => {

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
          
          } else if (field.type == "options") {

            const options = field.options.map(o => [o, o])

            this.appendDummyInput()
              .appendField(field.name)
              .appendField(new Blockly.FieldDropdown(options), field.name);

          } else if(field.type == "slot") {

            if(field.name != "default")
              this.appendDummyInput().appendField(field.name)
            this.appendStatementInput(field.name)

            // Add the custom validator for the input connection if allowedChildren is defined
            if (field.allowedChildren) {
              this.getInput(field.name).connection.setCheck(field.allowedChildren);
            }

          } else if(field.type == "sheetColumn") {

            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new customFields.SheetColumnField(field), field.name);
        
          } else if(field.type == "sheetId") {

            this.appendDummyInput()
            .appendField(field.name)
            .appendField(new customFields.SheetIdField(field), field.name);
          
          } else if(field.type == "extraProps") {

            this.appendDummyInput()
            .appendField(new customFields.ExtraPropsField(field.props), "extraProps");
          
          } else {
            console.log("unsupported blockly field type", field.type);
          }
        }

        // allow block to connect to other blocks top and below
        this.setNextStatement(true);
        this.setPreviousStatement(true, blockObject.slotCategory);

        // color
        this.setColour(blockObject.colour ? blockObject.colour : defaultBlockColour);
      },
      data: JSON.stringify({ origin: blockObject.origin }) // TODO escape characters or use a more appropriate format https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
    }
  }

}