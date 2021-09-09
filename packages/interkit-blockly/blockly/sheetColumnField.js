export default (Blockly, update) => {

  console.log("init sheetColumnField")
  const CustomFields = {}

  /* sheetColumn field */

  CustomFields.SheetColumnField = function(opt_value, opt_validator) {
    /*opt_value = this.doClassValidation_(opt_value);
    if (opt_value === null) {
      opt_value = "not specified";
    }  // Else the original value is fine.*/

    CustomFields.SheetColumnField.superClass_.constructor.call(
        this, opt_value, opt_validator);

    // this is initialised in getBlockObject.js
    let value = {
      columnType: opt_value?.columnType,
      refKey: opt_value?.refKey,
      value: opt_value?.defaultValue,
      text: opt_value?.defaultValue,
      options: opt_value?.options
    }  
    this.setValue(value);
  };
  Blockly.utils.object.inherits(CustomFields.SheetColumnField, Blockly.Field);

  // this is not used anymore as we create fields through JS api

  CustomFields.SheetColumnField.fromJson = function(options) {
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
    return new CustomFields.SheetColumnField(value);
  };

  CustomFields.SheetColumnField.prototype.SERIALIZABLE = true;

  CustomFields.SheetColumnField.prototype.toXml = function(fieldElement) {
    fieldElement.setAttribute('value', this.value_.value);
    fieldElement.setAttribute('text', this.value_.text);
    fieldElement.setAttribute('columnType', this.value_.columnType);
    fieldElement.setAttribute('refKey', this.value_.refKey);
    fieldElement.setAttribute('options', this.value_.options);
    fieldElement.setAttribute('fieldType', 'sheetColumn');


    return fieldElement;
  };

  CustomFields.SheetColumnField.prototype.fromXml = function(fieldElement) {
    var value = {};

    value.value = fieldElement.getAttribute('value');
    value.text = fieldElement.getAttribute('text');
    value.columnType = fieldElement.getAttribute('columnType');
    value.refKey = fieldElement.getAttribute('refKey');
    value.options = fieldElement.getAttribute('options');
    this.setValue(value);
  };


  CustomFields.SheetColumnField.prototype.showEditor_ = async function() {
    try {
      let value = await update(this.getValue(), this.name);
      console.log("got value", value)
      this.setValue(value);
     } catch(e) {
       console.log("error:", e)
     }
  }

  CustomFields.SheetColumnField.prototype.getDisplayText_ = function() {
    return this.getValue()?.text
  }

  Blockly.fieldRegistry.register('sheetColumn', CustomFields.SheetColumnField);


  console.log("Blockly.fieldRegistry done")

  return CustomFields.SheetColumnField;
}
