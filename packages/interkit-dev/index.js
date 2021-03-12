import { initCodeGenerator } from './blockly/code_generator.js'
import definitions from './blockly/block_definitions.json'
import toolbox from './blockly/toolbox.json'

const blocklyConfig = {
  definitions,
  toolbox,
  initCodeGenerator
}

export {
  blocklyConfig
}