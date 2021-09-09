export default (Blockly, update) => {

  /* sheetId field */ 

  const CustomFields = {}

  //console.log("init sheetIdField")

  CustomFields.SheetIdField = function(opt_value, opt_validator) {
    /*opt_value = this.doClassValidation_(opt_value);
    if (opt_value === null) {
      opt_value = "not specified";
    }  // Else the original value is fine.*/

    // save value passed in from fromJson so that it can be use by toXml
    CustomFields.SheetIdField.superClass_.constructor.call(
        this, opt_value, opt_validator);

    let value = {
      value: opt_value?.defaultValue, 
      text: opt_value?.defaultValue
    }
    this.setValue(value);
    //console.log(this.getValue())    
  };
  Blockly.utils.object.inherits(CustomFields.SheetIdField, Blockly.Field);

  // this is called when a block with this field is created

  CustomFields.SheetIdField.fromJson = function(options) {
    //console.log("json options", options)
    /*var value = Blockly.utils.replaceMessageReferences(
      options['value']);*/
    let value = {
      value: options.value, 
      text: options.text
    }
    //console.log(value)
    return new CustomFields.SheetIdField(value);
  };

  CustomFields.SheetIdField.prototype.SERIALIZABLE = true;

  CustomFields.SheetIdField.prototype.toXml = function(fieldElement) {
    //console.log(this.value_)
    fieldElement.setAttribute('value', this.value_.value);
    fieldElement.setAttribute('text', this.value_.text);

    // mark this field as type sheetId
    fieldElement.setAttribute('fieldType', 'sheetId');
    
    return fieldElement;
  };

  CustomFields.SheetIdField.prototype.fromXml = function(fieldElement) {
    var value = {};
    value.value = fieldElement.getAttribute('value');
    value.text = fieldElement.getAttribute('text');
    this.setValue(value);
  };


  CustomFields.SheetIdField.prototype.showEditor_ = async function() {
    try {
      let value = await update(this.getValue(), this.name);
      console.log("got value", value)
      this.setValue(value);
     } catch(e) {
       console.log("error:", e)
     }
  }

  CustomFields.SheetIdField.prototype.getDisplayText_ = function() {
    return this.getValue()?.text
  }

  Blockly.fieldRegistry.register('sheetId', CustomFields.SheetIdField);
  
  return CustomFields.SheetIdField;
}
