export default (Blockly, update) => {

  console.log("init sheetColumnField")
  
  /* sheetColumn field */

  class SheetColumnField extends Blockly.FieldTextInput {
    constructor(opt_value, validator) {
      //console.log("SheetColumnField constructor", opt_value);
      super(opt_value, validator)

      let value = {
        columnType: opt_value?.columnType,
        refKey: opt_value?.refKey,
        value: opt_value?.defaultValue,
        text: opt_value?.defaultValue,
        options: opt_value?.options
      }  
      this.setValue(value);
      
      this.SERIALIZABLE = true;
      this.EDITABLE = true;
    }

    fromJson(options) {
      //console.log("SheetColumnField.fromJson");
      /*var value = Blockly.utils.replaceMessageReferences(
        options['value']);*/
      //console.log(options)
      let value = {
        columnType: options.columnType,
        refKey: options.refKey,
        value: options.value,
        text: options.value,
        options: options.options
      }  
      return new SheetColumnField(value);
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
      //console.log("SheetColumnField.toXml", this.value_);
      fieldElement.setAttribute('value', this.value_.value);
      fieldElement.setAttribute('text', this.value_.text);
      fieldElement.setAttribute('columnType', this.value_.columnType);
      fieldElement.setAttribute('refKey', this.value_.refKey);
      fieldElement.setAttribute('options', this.value_.options);
      fieldElement.setAttribute('fieldType', 'sheetColumn');


      return fieldElement;
    }

    fromXml(fieldElement) {
      //console.log("SheetColumnField.fromXml");
      var value = {};

      value.value = fieldElement.getAttribute('value');
      value.text = fieldElement.getAttribute('text');
      value.columnType = fieldElement.getAttribute('columnType');
      value.refKey = fieldElement.getAttribute('refKey');
      value.options = fieldElement.getAttribute('options');
      this.setValue(value);
    }


    async showEditor_() {
      //super.showEditor_();
      //console.log("SheetColumnField.showEditor_");
      try {
        let value = await update(this.getValue(), this.name);
        console.log("got value", value)
        this.setValue(value);
        this.render_();
        console.log(this)
      } catch(e) {
        console.log("error:", e)
      }
    }
    
    doClassValidation_(value) {
      //console.log("doClassValidation")
      return value;
    }

    doValueUpdate_(value) {
      //console.log("doValueUpdate", value)
      this.value_ = value;
    }

    getText_() {
      //console.log("SheetColumndField.getText")
      return this.value_?.text
    }

    getDisplayText_() {
      //console.log("SheetColumndField.getDisplayText")
      return this.value_?.text
    }

  }


  Blockly.fieldRegistry.register('sheetColumn', SheetColumnField);

  

  return SheetColumnField;
}
