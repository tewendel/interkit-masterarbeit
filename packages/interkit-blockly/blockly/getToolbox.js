import { getBlockObjects } from './getBlockObjects.js'

export const getToolbox = (Blockly) => {

  // get block objects
  const blockObjects = getBlockObjects();

  // read out categories
  let categories = {};
  for(let blockObject of blockObjects) {
    if(!categories[blockObject.toolboxCategory]) {
      categories[blockObject.toolboxCategory] = []
    }
    categories[blockObject.toolboxCategory].push(blockObject.name)
  }

  // create toolbox object that blockly understands
  /*

  {
    "kind": "categoryToolbox",
    "contents": [{
        "kind": "category",
        "name": "Menu",
        "contents": [
          {
            "kind": "block",
            "type": "BottomMenu"
          },
          {
            "kind": "block",
            "type": "BottomMenuPage"
          },
          {
            "kind": "block",
            "type": "BottomMenuButton"
          }
        ]
      }
     ]
   }

  */

  let toolbox = {
    kind: "categoryToolbox",
    contents: []
  }

  for(let category in categories) {
    toolbox.contents.push({
      kind: "category",
      name: category,
      contents: categories[category].map(e=>{
        return {
          kind: "block",
          type: e
        }
      })
    })
  }

  return toolbox;
}