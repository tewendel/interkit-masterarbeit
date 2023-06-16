//import { getBlockObjects } from './getBlockObjects.js'

const verbose = false

export const initCodeGenerator = (Blockly, javascriptGenerator, blockObjects, workspace) => {
  /* helper functions */

  const escapeCurlyBrackets = (string) => {
    return string.replaceAll("{", "&#123;").replaceAll("}", "&#125;")
  }

  const attribute = (block, attributeName, blocklyAttributeName, fieldType) => {
    
    if(!blocklyAttributeName) blocklyAttributeName = attributeName;
    
    // if fieldValue is an object with value attribute, use that (eg special field sheetColumn)
    // otherwise use fieldValue directly (eg vanilla string field)

    var value = block.getFieldValue(blocklyAttributeName)

    if(typeof value == "object") {
      //console.log("fieldValue is object with nested oject", blocklyAttributeName, block.getFieldValue(blocklyAttributeName))
      value = value?.value;
      //console.log("changed value to", value)
    }

    if (verbose) console.log('#CG# attribute', { block, attributeName, value })

    if (value == "undefined" || value == "null") {
      return "";
    }


    // only do I18n if the value is a plain string
    if(typeof value == "string") {
      // for "static-y string attributes" that start with a $
      if (value?.substr(0, 1) === '$') {
        // nasty nested ternary to avoid over-reliance on new-ish ?. because this is likely not babel-ed
        return `${attributeName}={$lang ? ($translations[$lang] && $translations[$lang]["${value}"] ? $translations[$lang]["${value}"] : "${value.substr(1)}") : "…"}`
      }
      // is this a sheetColumn reference?
      if (attributeName?.toLowerCase?.().indexOf('column') > -1 && value?.indexOf('/') > -1) {
        if (/\$lang\b/.test(value)) {
          return `${attributeName}={$lang ? "${value}".replace("$lang", "$" + $lang) : "${value}"}`
        }
      }
    } else {
      if(fieldType != "checkbox") {
        console.log("attribute generator - warning, value not a string", { block, attributeName, value, fieldType })
        return "";
      }      
    }

    if(value) {
      if(fieldType == "checkbox") {
        return `${attributeName}={${value == "TRUE" ? true : false}}\n`
      } else {
        return `${attributeName}="${escapeCurlyBrackets(value)}"\n`
      }
    }
    return "";
  }

  const attributes = (block, attributeNames) => {
    return attributeNames.map(a => attribute(block, a)).join(" ")
  }

  // exract data from extraProps field and format as a prop
  const extraProp = (block, prop) => {
    
    let blockJson = Blockly.serialization.blocks.save(block);    
    let jsonExtraProp = blockJson?.fields?.extraProps?.props?.find(p => p.name == prop.name)

    let value = jsonExtraProp?.value;
    if(typeof value == "undefined" && typeof prop?.defaultValue != "undefined") {
      value = jsonExtraProp?.defaultValue
    }

    if (verbose) console.log('#CG# extraProp', { value, ...prop })

    if(prop.type == "effect") {
      return `${prop.name}={${JSON.stringify(value)}}\n`;
    }

    if(typeof value == "boolean") {
      return `${prop.name}={${value}}\n`;
    }

    if(prop.type == "sheetColumn" && value) {
      if(value.sheetKey == "empty") return "";
      if (value.columnKey?.indexOf?.('$lang') > -1) {
        return `${prop.name}={$lang ? "${value.sheetKey}/" + "${value.columnKey}".replace("$lang", "$" + $lang) : "${value.sheetKey}/${value.columnKey}"}`
      }
      value = value.sheetKey + "/" + value.columnKey
    }

    if(prop.type == "sheetId" && value) {
      value = value.sheetKey
    }

    if (value?.substr?.(0, 1) === '$') {
      return `${prop.name}={$lang ? ($translations[$lang] && $translations[$lang]["${value}"] ? $translations[$lang]["${value}"] : "${value.substr(1)}") : "…"}`
    }

    return value ? `${prop.name}="${escapeCurlyBrackets(value)}"\n` : "";
  }

  const slot = (block, slotName, slotProp) => {
    var value = javascriptGenerator.statementToCode(block, slotName)
    if (verbose) console.log('#CG# slot', { slotName, slotProp, value })
    return value ? 
        (`<svelte:fragment slot="${slotName}" `
        + (slotProp ? `let:${slotProp}={${slotProp}} >` : '>')
        + `\n${value}\n
        </svelte:fragment>\n`) : "";
  }

  const statements = (block, blocklyAttributeName) => {
    var statements_name = javascriptGenerator.statementToCode(block, blocklyAttributeName);    
    if (verbose) console.log('#CG# statement', statements_name)
    return `${statements_name}`  
  }

  // helper for Group and Route references
  const referencedBlockToCode = (types, field, key, method, slotName) => {
    for(let type of types) {
      //console.log("blockTypeToCode", type, field, key)
      let blocks = workspace.getBlocksByType(type)
      for(let block of blocks) {
        if(block.getFieldValue(field) == key) {
          let code;
          if(method == "slot")
            code = javascriptGenerator.statementToCode(block, slotName)
          if(method == "block")
            code = javascriptGenerator.blockToCode(block)
          return code
        }
      }
    }
  }
  
  /* generate code generators from block definitions */
  console.log("initCodeGenerator");

  //const blockObjects = getBlockObjects();    

  for(let blockObject of blockObjects) {
    javascriptGenerator[blockObject.name] = function(block) {

      // special blockly control blocks

      if(blockObject.name == "GroupConnector") {
        //console.log("found GroupReference")
        return referencedBlockToCode(["Group"], "name", block.getFieldValue("name"), "slot", "default")        
      }

      if(blockObject.name == "RouteConnector") {
        //console.log("found GroupReference")
        return referencedBlockToCode(["Route", "DataRouteMulti", "DataRouteSingle", "ChatRoute"], "path", block.getFieldValue("path"), "block")        
      }

      if(blockObject.name == "Group") {
        return ""
      }
      
      // opening tag
      let code = `<${blockObject.name}\n`;
       
      // props
      for(let field of blockObject.fields) {
        if(field.type != "slot" && field.type != "extraProps") {
          code += "   " + attribute(block, field.name, field.name, field.type)
        }
        if(field.type == "extraProps") {
          if (verbose) console.log('#CG# extraProps', field.props, block)
          for(let prop of field.props) {
            code += "   " + extraProp(block, prop);
            //console.log(extraProp(block, prop));
          }

        }
      }
      if(blockObject.hiddenProps) {
        if (verbose) console.log('#CG# hiddenProps', blockObject.hiddenProps)
        code += "   " + blockObject.hiddenProps.map(p=>`{${p}}`).join(" ") + "\n"
      }
      code += `>\n`

      // slots
      for(let field of blockObject.fields) {
        if(field.type == "slot") {
          if(field.name != "default")
             code += (`<svelte:fragment slot="${field.name}"`
                   + (field?.slotProps ? field.slotProps.map(p=>` let:${p}={${p}}`).join(" ") : "")
                   + ">\n")

          code += statements(block, field.name)
          
          if(field.name != "default")
            code += "</svelte:fragment>\n"
        }        
      }

      // closing tag
      code += `</${blockObject.name}>\n`

      return code;
    }
  }

  /* old manual code generators for reference

  Blockly.JavaScript['HeadlinePage'] = function(block) {
    var text_label = block.getFieldValue('NAME');
    return `<HeadlinePage headline="${text_label}"/>\n`
  };

  
  Blockly.JavaScript['AppBase'] = function (block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    let code = `<AppBase
      sectionTitles="${text_sectiontitles}"
      sectionRefs="${text_sectionrefs}"
      >\n${statements_name}\n</AppBase>\n`
    return code;
  };

  Blockly.JavaScript['Dashboard'] = function(block) {
    var code = "<Dashboard \n"
    code += attributes(block, [
      "sectionTitles", 
      "sectionRefs",
      "sectionCategoryRef",
      "sectionCategory2Ref",
      "sectionTypes",
      "sectionImage",
      "sectionOrder",
      "elementTitleColumn",
      "elementDescriptionColumn",      
      "elementShortDescriptionColumn",      
      "elementAudioColumn",
      "elementLocationColumn",
      "elementMinDistanceColumn",
      "elementImageColumn",
      "elementSupertextColumn",
      "elementCategoryRefColumn",
      "elementCategoryOrderColumn",
      "elementCategory2RefColumn",
      "elementCategory2OrderColumn",
      "elementLinkColumn",
      "categoryTitleColumn",
      "categorySubtitleColumn",
      "categoryDescriptionColumn",
      "categoryImageColumn",
      "categoryUnlistedColumn",
      "category2TitleColumn",
      "category2SubtitleColumn",
      "category2DescriptionColumn",
      "category2ImageColumn"
      ])




    code += " />\n"
    return code;
  };

  Blockly.JavaScript['Tab'] = function(block) {
    var text_label = block.getFieldValue('label');
    return `<Tab label="${text_label}"/>\n`
  };

  Blockly.JavaScript['TabPanel'] = function(block) {
    
    var code = "<TabPanel "
    code += attribute(block, "path");
    code += " >\n";
    code += statements(block, "default");
    code += "</TabPanel>\n"
    return code;
  };

  Blockly.JavaScript['Tabs'] = function(block) {
    
    var code = "<Tabs>\n";
    code += slot(block, "tabList") 
    code += slot(block, "tabPanels") 
    code += "</Tabs>\n"
    return code;
  };


  Blockly.JavaScript['ListNav'] = function(block) {
    
    var code = "<ListNav>\n";
    code += slot(block, "listView") 
    code += slot(block, "singleView") 
    code += "</ListNav>\n"
    return code;
  };

  
  Blockly.JavaScript['CategoryList'] = function(block) {
    
    var code = "<CategoryList \n";
    code += attribute(block, "categorySheetKey")
    code += attribute(block, "nameKey")
    code += attribute(block, "imageKey")
    code += attribute(block, "descriptionKey")
    code += attribute(block, "unlistedKey")
    code += attribute(block, "orderKey")
    code += "/>\n"
    return code;
  };

  Blockly.JavaScript['ElementList'] = function(block) {
    
    var code = "<ElementList \n";
    code += attribute(block, "dataSheetKey")
    code += attribute(block, "sortColumn")
    code += attribute(block, "hideColumn")
    code += attribute(block, "bookmarkFilter")
    code += ">\n"
    code += slot(block, "contentElement", "element") 
    code += slot(block, "emptyElement", "element") 
    code += "</ElementList>\n"
    return code;
  };

  Blockly.JavaScript['Map'] = function(block) {

    let code = "<Map \n"
    code += attributes(block, ["markerPositions", "markerIconAsset", "defaultLocation", "permissionNotification", "mainLayerLabel", "hideOnMapColumn"]);
    code += ">\n";
    code += slot(block, "element", "element");
    code += slot(block, "filters");
    code += slot(block, "layers");
    code += "</Map>"

    return code;
  };

  Blockly.JavaScript['MapCategoryFilter'] = function(block) {

    let code = "<MapCategoryFilter \n"
    code += attributes(block, [
      "name", 
      "categoryNameColumn", 
      "categoryColorColumn", 
      "elementRefColumn",
      "categoryUnlistedColumn",
      "categoryOrderColumn",
      "filterKeyColumn",
      "connectedLayerKeyColumn"
    ])
    code += "/>\n";

    return code;
  };



  Blockly.JavaScript['Styling'] = function(block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    var colour_primary_color = block.getFieldValue('primary_color');
    var text_font_family = block.getFieldValue('font_family');
    var text_google_font = block.getFieldValue('google_font');
    
    let code = `<Styling 
      primary_color="${colour_primary_color}"
      font_family="${text_font_family}"
      google_font="${text_google_font}"
      >\n${statements_name}\n</Styling>\n`

    return code;
  };

  Blockly.JavaScript['BottomMenu'] = function(block) {
    var statements_pages = Blockly.JavaScript.statementToCode(block, 'pages');
    var statements_buttons = Blockly.JavaScript.statementToCode(block, 'buttons');
    var statements_media_player = Blockly.JavaScript.statementToCode(block, 'media_player');
    
    let code = `
      <BottomMenu>
        <svelte:fragment slot="pages">
          ${statements_pages}
        </svelte:fragment>
        <svelte:fragment slot="media_player">
          ${statements_media_player}
        </svelte:fragment>
        <svelte:fragment slot="buttons">
          ${statements_buttons}
        </svelte:fragment>
        
      </BottomMenu>\n
    `
    return code;
  };
  
  Blockly.JavaScript['BottomMenuPage'] = function(block) {
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');    
    var code = "<BottomMenuPage "
    code += attribute(block, "path");
    code += ">\n"
    code += `${statements_name}`
    code +=`\n</BottomMenuPage>\n`
    return code
  };

  Blockly.JavaScript['BottomMenuButton'] = function(block) {
    var text_label = block.getFieldValue('label');
    return `<BottomMenuButton label="${text_label}"/>\n`
  };

  Blockly.JavaScript['HeadlinePage'] = function(block) {
    var text_label = block.getFieldValue('NAME');
    return `<HeadlinePage headline="${text_label}"/>\n`
  };

  Blockly.JavaScript['ContentElementAudioBlocklyWrapper'] = function(block) {

    var code = "<ContentElementAudioBlocklyWrapper {element} \n";
    code += attributes(block, [
       "titleColumn",
       "audioColumn",
       "descriptionColumn",
       "imageColumn",
       "categoryRefColumn", 
       "categoryOrderColumn",
       "categoryTitleColumn",
       "categorySubtitleColumn",
       "locationColumn",
       "shortDescriptionColumn",
       "minDistanceColumn",
       "useBookmarks"
    ]);
    
    code += "\n/>\n"

    return code;
  };

  Blockly.JavaScript['AudioPlayer'] = function(block) {
    var code = "<AudioPlayer \n";
    code += attributes(block, [
       "titleColumn",
       "audioColumn",
       "descriptionColumn",
       "imageColumn",
       "categoryRefColumn", 
       "categoryOrderColumn",
       "categoryTitleColumn",
       "categorySubtitleColumn",
       "locationColumn",
       "minDistanceColumn",
       "colorCategoryRefColumn",
       "categoryColorColumn"
    ]);
    code += "\n/>\n";
    return code;
  };

  Blockly.JavaScript['Theming'] = function (block) {
    var code = "<Theming \n"
    code += attribute(block,"cssFile")
    code += attribute(block, "jsFile")
    code += " />\n"
    return code;
  };

  Blockly.JavaScript['TopNav'] = function (block) {
    var code = "<TopNav \n"
    code += attribute(block, "label")
    code += ">\n"
    code += statements(block, "default")
    code += "</TopNav>\n"
    return code;
  };

  Blockly.JavaScript['Subsections'] = function (block) {
    var code = "<Subsections \n"
    code += ">\n"
    code += statements(block, "default")
    code += "</Subsections>\n"
    return code;
  };

  Blockly.JavaScript['Subsection'] = function (block) {
    var code = "<Subsection \n"
    code += attribute(block, "title")
    code += ">\n"
    code += statements(block, "default")
    code += "</Subsection>\n"
    return code;
  };

  Blockly.JavaScript['DynamicContent'] = function(block) {
    var code = "<DynamicContent \n";
    code += attributes(block, [
       "keyColumn", "contentColumn", "contentKey", "format"
    ]);
    code += "\n/>\n";
    return code;
  };

  Blockly.JavaScript['MapLayer'] = function(block) {
    var code = "<MapLayer \n";
    code += attributes(block, [
       "name", "assetPath", "topLeft", "bottomRight", "audio", "hideLabels", "layerKey", "connectedFilterKey", "hideMarkers"
    ]);
    code += "\n/>\n";
    return code;
  };

  Blockly.JavaScript['ScrollContainer'] = function (block) {
    var code = "<ScrollContainer \n"
    code += ">\n"
    code += statements(block, "default")
    code += "</ScrollContainer>\n"
    return code;
  };
  */



  
  
}
