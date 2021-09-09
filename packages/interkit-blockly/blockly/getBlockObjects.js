export const getBlockObjects = (Blockly) => {

  // example js object for building block definition generator
  // todo: replace with api call to read yamls
  
  const blockObjects = [{
    name: "HeadlinePage",
    title: "Headline Page",
    color: 240,
    fields: [{
      type: "string",
      name: "NAME",
      "defaultValue": "default"
    }],
    toolboxCategory: "Pages"
  }]

  

  return blockObjects;
}