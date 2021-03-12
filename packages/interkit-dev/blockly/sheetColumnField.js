export default (Blockly, update) => {

  console.log("init sheetColumnField")
  const CustomFields = {}

  CustomFields.SheetColumnField = function(opt_value, opt_validator) {
    opt_value = this.doClassValidation_(opt_value);
    if (opt_value === null) {
      opt_value = "not specified";
    }  // Else the original value is fine.

    CustomFields.SheetColumnField.superClass_.constructor.call(
        this, opt_value, opt_validator);
  };
  Blockly.utils.object.inherits(CustomFields.SheetColumnField, Blockly.Field);

  CustomFields.SheetColumnField.fromJson = function(options) {
    var value = Blockly.utils.replaceMessageReferences(
      options['value']);
    return new CustomFields.SheetColumnField(value);
  };

  CustomFields.SheetColumnField.prototype.SERIALIZABLE = true;

  CustomFields.SheetColumnField.prototype.toXml = function(fieldElement) {
    fieldElement.setAttribute('value', this.value_.value);
    fieldElement.setAttribute('text', this.value_.text);
    return fieldElement;
  };

  CustomFields.SheetColumnField.prototype.fromXml = function(fieldElement) {
    var value = {};

    value.value = fieldElement.getAttribute('value');
    value.text = fieldElement.getAttribute('text');
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

  return CustomFields;
}
