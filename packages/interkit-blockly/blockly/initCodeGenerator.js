//import { getBlockObjects } from './getBlockObjects.js'

export const initCodeGenerator = (Blockly, blockObjects) => {

  /* helper functions */
  const attribute = (block, attributeName, blocklyAttributeName) => {
    if(!blocklyAttributeName) blocklyAttributeName = attributeName;
    
    // if fieldValue is an object with value attribute, use that (eg special field sheetColumn)
    // otherwise use fieldValue directly (eg vanilla string field)
    var value = block.getFieldValue(blocklyAttributeName)?.value ?
      block.getFieldValue(blocklyAttributeName)?.value
      : block.getFieldValue(blocklyAttributeName)

    if(value == "undefined" || value == "null") value = null;

    return value ? `${attributeName}="${value}"\n` : "";
  }

  const attributes = (block, attributeNames) => {
    return attributeNames.map(a => attribute(block, a)).join(" ")
  }

  const slot = (block, slotName, slotProp) => {
    var value = Blockly.JavaScript.statementToCode(block, slotName)
    return value ? 
        (`<svelte:fragment slot="${slotName}" `
        + (slotProp ? `let:${slotProp}={${slotProp}} >` : '>')
        + `\n${value}\n
        </svelte:fragment>\n`) : "";
  }

  const statements = (block, blocklyAttributeName) => {
    var statements_name = Blockly.JavaScript.statementToCode(block, blocklyAttributeName);    
    return `${statements_name}`  
  }

  /* generate code generators from block definitions */
  console.log("initCodeGenerator");

  //const blockObjects = getBlockObjects();    

  for(let blockObject of blockObjects) {
    Blockly.JavaScript[blockObject.name] = function(block) {
      
      // opening tag
      let code = `<${blockObject.name}\n`;
       
      // props
      for(let field of blockObject.fields) {
        if(field.type != "slot") {
          code += attribute(block, field.name)
        }
      }
      code += `>`

      // slots
      for(let field of blockObject.fields) {
        if(field.type == "slot") {
          if(field.name != "default")
             code += `<svelte:fragment slot="${field.name}">`
          
          code += statements(block, field.name)
          
          if(field.name != "default")
            code += "</svelte:fragment>"
        }
      }

      // closing tag
      code += `</${blockObject.name}>`

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