export default (Blockly, update) => {

  console.log("init ExtraPropsField")
  
  /* ExtraPropsField field */

  class ExtraPropsField extends Blockly.FieldImage {
    constructor(props, blockName) {
      // call FieldImage constructor and pass in update as onClick function
      super("/images/sheet_icon_inv_padded_small.png", 24, 18, "extraProps")

      //console.log("setup ExtraPropsField with this", this)
      //console.log("extra props field constructor with props", props)
      this.props = props
      this.blockName = blockName
      
      this.SERIALIZABLE = true;
    }

    fromJson(options) {
      console.log("ExtraPropsField.fromJson", options);
      return new ExtraPropsField([]);
    }

    saveState() {
      //console.log("saveState extraProps", this.props)
      return {
        'props': this.props, 
      };
    }
    
    loadState(state) {
      //console.log("loadState extraProps", state)
      this.props = state['props'].map(p => ({ ...this.props.find(tp => tp.name === p.name) , ...p}));
    }

    async showEditor_() {
      //console.log("showEditor_", this.props);
      try {
        let newProps = await update(this.props, this.name, this.blockName);
        console.log("got props", newProps);
        this.props = newProps;
      } catch(e) {
        console.log(e)
      }
    }

  }

  try {
    Blockly.fieldRegistry.register('extraProps', ExtraPropsField);
  } catch(e) {
    console.log("error registering extraProps field", e)
  }


  return ExtraPropsField;
}
