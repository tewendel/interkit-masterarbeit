export default (Blockly, update) => {

  /* sheetId field */ 

  class SheetIdField extends Blockly.FieldTextInput {
    constructor(opt_value, validator) {
      super(opt_value, validator)
      let value = {
        value: opt_value?.defaultValue, 
        text: opt_value?.defaultValue
      }
      this.setValue(value);
      this.SERIALIZABLE = true;
    }
  
    fromJson(options) {
      //console.log("json options", options)
      /*var value = Blockly.utils.replaceMessageReferences(
        options['value']);*/
      let value = {
        value: options.value, 
        text: options.text
      }
      //console.log(value)
      return new SheetIdField(value);
    }

    saveState() {
      return {
        'value': this.getValue(),  // Value state
      };
    }
    
    loadState(state) {
      this.setValue(state['value']);
    }

    toXml(fieldElement) {
      //console.log(this.value_)
      fieldElement.setAttribute('value', this.value_.value);
      fieldElement.setAttribute('text', this.value_.text);

      // mark this field as type sheetId
      fieldElement.setAttribute('fieldType', 'sheetId');
      
      return fieldElement;
    }

    fromXml(fieldElement) {
      var value = {};
      value.value = fieldElement.getAttribute('value');
      value.text = fieldElement.getAttribute('text');
      this.setValue(value);
    }

    async showEditor_() {
      try {
        let value = await update(this.getValue(), this.name);
        //console.log("got value", value)
        this.setValue(value);
        this.render_();
      } catch(e) {
        console.log("error:", e)
      }
    }

    doClassValidation_(value) {
      return value;
    }

    doValueUpdate_(value) {
      this.value_ = value;
    }

    getText_() {
      return this.value_?.text
    }

    getDisplayText_() {
      return this.value_?.text
    }
  
  }
  try {
  Blockly.fieldRegistry.register('sheetId', SheetIdField);
  } catch(e) {
    console.log("error registering sheetId field", e)
  }
  
  return SheetIdField;
}
