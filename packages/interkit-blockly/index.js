//import definitions from './blockly/block_definitions.json'
//import toolbox from './blockly/toolbox.json'

import { initCodeGenerator } from './blockly/initCodeGenerator.js'
import { initBlockDefinitions } from './blockly/initBlockDefinitions.js'
import { getToolbox } from './blockly/getToolbox.js'

const blocklyConfig = {
  //definitions,
  //toolbox,
  initCodeGenerator,
  initBlockDefinitions,
  getToolbox
}

export {
  blocklyConfig
}