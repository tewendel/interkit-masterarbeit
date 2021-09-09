export const getBlockObjects = (Blockly) => {

  // example js object for building block definition generator
  // todo: replace with api call to read yamls

  const blockObjects = [
    {
      name: "HeadlinePage",
      colour: 220,
      fields: [{
        name: "headline",
        type: "string",
        defaultValue: "default"
      }],
      toolboxCategory: "Pages"
    },

    {
      name: "ScrollContainer",
      fields: [{
        type: "slot",
        name: "default"
      }]
    },

    {
      name: "Map",
      fields: [
        {
          name: "markerPositions",
          type: "sheetColumn",
          columnType: "location",
          defaultValue: "elements/position"
        },
        {
          name: "markerIconAsset",
          type: "string"
        },
        {
          "name": "defaultLocation",
          "type": "string"
        },
        {
          "name": "permissionNotification",
          "type": "string"
        },
        {
          "name": "element",
          "type": "slot"
        },
        {
          "name": "filters",
          "type": "slot"
        },
        {
          "name": "layers",
          "type": "slot"
        },
        {
          "name": "mainLayerLabel",
          "type": "string",
        },
        {
          "name": "hideOnMapColumn",
          "type": "sheetColumn",
          "columnType": "string",
          "defaultValue": "elements/hideOnMap"
        }
      ]
    },

    {
      "name": "Dashboard",
      fields: [
        {
          "type": "sheetColumn",
          "name": "sectionTitles",
          "columnType": "string",
          "defaultValue": "dashboard/title"
        },
        {
          "type": "sheetColumn",
          "name": "sectionRefs",
          "columnType": "sheetRef",
          "refKey": "elements",
          "defaultValue": "dashboard/elements"
        },
        {
          "type": "sheetColumn",
          "name": "sectionTypes",
          "columnType": "optionSelect",
          "defaultValue": "dashboard/type",
          "options": "ElementSingle, ElementSlider, ElementNearest, ElementRandom, CategorySlider, FeaturedCategory, MenuSwitcher"
        },
        {
          "type": "sheetColumn",
          "name": "elementTitleColumn",
          "columnType": "string",
          "defaultValue": "elements/title"
        },
        {
          "type": "sheetColumn",
          "name": "elementDescriptionColumn",
          "columnType": "richText",
          "defaultValue": "elements/description"
        },
        {
          "type": "sheetColumn",
          "name": "elementAudioColumn",
          "columnType": "mediaFile",
          "defaultValue": "elements/audio"
        },
        {
          "type": "sheetColumn",
          "name": "elementImageColumn",
          "columnType": "mediaFile",
          "defaultValue": "elements/image"
        },
        {
          "type": "sheetColumn",
          "name": "categoryTitleColumn",
          "columnType": "string",
          "defaultValue": "categories/name"
        },
        {
          "type": "sheetColumn",
          "name": "categoryDescriptionColumn",
          "columnType": "string",
          "defaultValue": "categories/description"
        },
        {
          "type": "sheetColumn",
          "name": "categoryImageColumn",
          "columnType": "mediaFile",
          "defaultValue": "categories/image"
        },
        {
          "type": "sheetColumn",
          "name": "sectionCategoryRef",
          "columnType": "sheetRef",
          "defaultValue": "dashboard/category",
          "refKey": "categories"
        },
        {
          "type": "sheetColumn",
          "name": "sectionImage",
          "columnType": "mediaFile",
          "defaultValue": "dashboard/image"
        },
        {
          "type": "sheetColumn",
          "name": "sectionOrder",
          "columnType": "number",
          "defaultValue": "dashboard/order"
        },
        {
          "type": "sheetColumn",
          "name": "sectionCategory2Ref",
          "columnType": "sheetRef",
          "defaultValue": "dashboard/category2",
          "refKey": "categories2"
        },
        {
          "type": "sheetColumn",
          "name": "category2TitleColumn",
          "columnType": "string",
          "defaultValue": "categories2/name"
        },
        {
          "type": "sheetColumn",
          "name": "category2DescriptionColumn",
          "columnType": "string",
          "defaultValue": "categories2/description"
        },
        {
          "type": "sheetColumn",
          "name": "category2ImageColumn",
          "columnType": "mediaFile",
          "defaultValue": "categories2/image"
        },
        {
          "name": "elementCategoryRefColumn",
          "type": "sheetColumn",
          "columnType": "sheetRef",
          "refKey": "categories",
          "defaultValue": "elements/category"
        },
        {
          "name": "elementCategory2RefColumn",
          "type": "sheetColumn",
          "columnType": "sheetRef",
          "refKey": "categories2",
          "defaultValue": "elements/category2"
        },
        {
          "type": "sheetColumn",
          "name": "elementCategoryOrderColumn",
          "columnType": "number",
          "defaultValue": "elements/categoryOrder"
        },
        {
          "type": "sheetColumn",
          "name": "elementCategory2OrderColumn",
          "columnType": "number",
          "defaultValue": "elements/category2Order"
        },
        {
          "type": "sheetColumn",
          "name": "categorySubtitleColumn",
          "columnType": "string",
          "defaultValue": "categories/subtitle"
        },
        {
          "type": "sheetColumn",
          "name": "category2SubtitleColumn",
          "columnType": "string",
          "defaultValue": "categories2/subtitle"
        },
        {
          "type": "sheetColumn",
          "name": "elementLocationColumn",
          "columnType": "string",
          "defaultValue": "elements/position"
        },
        {
          "type": "sheetColumn",
          "name": "elementSupertextColumn",
          "columnType": "string",
          "defaultValue": "elements/supertext"
        },
        {
          "type": "sheetColumn",
          "name": "categoryUnlistedColumn",
          "columnType": "string",
          "defaultValue": "categories/unlisted"
        },
        {
          "type": "sheetColumn",
          "name": "elementLinkColumn",
          "columnType": "string",
          "defaultValue": "elements/link"
        },
        {
          "type": "sheetColumn",
          "name": "elementShortDescriptionColumn",
          "columnType": "richText",
          "defaultValue": "elements/short_description"
        },
        {
          "name": "elementMinDistanceColumn",
          "type": "sheetColumn",
          "columnType": "number",
          "defaultValue": "elements/minDistance"
        },
    ],
    "colour": 230,
  },


  
  {
    "name": "CategoryList",
    fields: [
      {
        "type": "sheetId",
        "name": "categorySheetKey",
        "defaultValue": "categories"
      },
      {
        "name": "nameKey",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/name"
      },
      {
        "name": "imageKey",
        "type": "sheetColumn",
        "columnType": "mediaFile",
        "defaultValue": "categories/image"
      },
      {
        "name": "descriptionKey",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/description"
      },
      {
        "name": "unlistedKey",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/unlisted"
      },
      {
        "name": "orderKey",
        "type": "sheetColumn",
        "columnType": "number",
        "defaultValue": "categories/order"
      },
    ],
    "colour": 180,
  },


  {
    "name": "ElementList",
    fields: [
      {
        "type": "sheetId",
        "name": "dataSheetKey",
        "defaultValue": "elements",
      },
      {
        "type": "sheetColumn",
        "name": "sortColumn",
        "defaultValue": "elements/categoryOrder",
        "columnType": "number"
      },
      {
        "type": "checkbox",
        "name": "bookmarkFilter"
      },
      {
        "type": "slot",
        "name": "contentElement"
      },
      {
        "type": "slot",
        "name": "emptyElement"
      },
      {
        "name": "hideColumn",
        "type": "sheetColumn",
        "defaultValue": "elements/hideInArchive",
        "columnType": "string"
      },
    ],
    "colour": 180,
  },


  {
    "name": "Styling",
    fields: [
      {
        "type": "slot",
        "name": "NAME"
      },
      {
        "type": "field_colour",
        "name": "primary_color",
        "colour": "#ff0000"
      },
      {
        "type": "string",
        "name": "font_family",
        "text": "inter"
      },
      {
        "type": "string",
        "name": "google_font",
        "defaultValue": "Inter:wght@100"
      }
    ],
    "colour": 0    
  },
    
  
  {
    "name": "BottomMenu",
    fields: [
      {
        "type": "slot",
        "name": "pages"
      },
      {
        "type": "slot",
        "name": "media_player"
      },
      {
        "type": "slot",
        "name": "buttons"
      }
    ],
    "colour": 130,    
   },


   {
      "name": "BottomMenuPage",
      fields: [
        {
          "type": "slot",
          "name": "NAME"
        },
        {
          "type": "string",
          "name": "path"
        }
      ],
      "colour": 130,
    },


  {
    "name": "BottomMenuButton",
     fields: [
      {
        "type": "string",
        "name": "label",
        "defaultValue": "default"
      }
    ],
    "colour": 130,
    
  },

  
  {
    "name": "AudioPlayer",
    fields: [
      {
        "name": "titleColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "elements/title"
      },
      {
        "name": "audioColumn",
        "type": "sheetColumn",
        "columnType": "mediaFile",
        "defaultValue": "elements/audio"
      },
      {
        "name": "descriptionColumn",
        "type": "sheetColumn",
        "columnType": "richText",
        "defaultValue": "elements/description"
      },
      {
        "name": "imageColumn",
        "type": "sheetColumn",
        "columnType": "mediaFile",
        "defaultValue": "elements/image"
      },
      {
        "name": "categoryRefColumn",
        "type": "sheetColumn",
        "columnType": "sheetRef",
        "refKey": "categories",
        "defaultValue": "elements/category"
      },
      {
        "name": "categoryOrderColumn",
        "type": "sheetColumn",
        "columnType": "number",
        "defaultValue": "elements/categoryOrder"
      },
      {
        "name": "categoryTitleColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/name"
      },
      {
        "name": "categorySubtitleColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/subtitle"
      },
      {
        "name": "locationColumn",
        "type": "sheetColumn",
        "columnType": "location",
        "defaultValue": "elements/position"
      },
      {
        "name": "minDistanceColumn",
        "type": "sheetColumn",
        "columnType": "number",
        "defaultValue": "elements/minDistance"
      },
      {
        "name": "colorCategoryRefColumn",
        "type": "sheetColumn",
        "columnType": "sheetRef",
        "refKey": "categories2",
        "defaultValue": "elements/category2"
      },
      {
        "name": "categoryColorColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories2/color"
      },
    ],
    "colour": 230,
    
  },

  {
    "name": "ContentElementAudioBlocklyWrapper",
    fields: [
      {
        "name": "titleColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "elements/title"
      },
      {
        "name": "audioColumn",
        "type": "sheetColumn",
        "columnType": "mediaFile",
        "defaultValue": "elements/audio"
      },
      {
        "name": "descriptionColumn",
        "type": "sheetColumn",
        "columnType": "richText",
        "defaultValue": "elements/description"
      },
      {
        "name": "imageColumn",
        "type": "sheetColumn",
        "columnType": "mediaFile",
        "defaultValue": "elements/image"
      },
      {
        "name": "categoryRefColumn",
        "type": "sheetColumn",
        "columnType": "sheetRef",
        "refKey": "categories",
        "defaultValue": "elements/category"
      },
      {
        "name": "categoryOrderColumn",
        "type": "sheetColumn",
        "columnType": "number",
        "defaultValue": "elements/categoryOrder"
      },
      {
        "name": "categoryTitleColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/name"
      },
      {
        "name": "categorySubtitleColumn",
        "type": "sheetColumn",
        "columnType": "string",
        "defaultValue": "categories/subtitle"
      },
      {
        "name": "locationColumn",
        "type": "sheetColumn",
        "columnType": "location",
        "defaultValue": "elements/position"
      },
      {
        "name": "shortDescriptionColumn",
        "type": "sheetColumn",
        "columnType": "richText",
        "defaultValue": "elements/short_description"
      },
      {
        "name": "minDistanceColumn",
        "type": "sheetColumn",
        "columnType": "number",
        "defaultValue": "elements/minDistance"
      },
      {
        "name": "useBookmarks",
        "type": "checkbox",
        "defaultValue": "TRUE"
      },
    ],
    "colour": 230,
    
  },

  {
    "name": "ListNav",
    fields: [  {
        "type": "slot",
        "name": "listView"
      },
      {
        "type": "slot",
        "name": "singleView"
      }
    ],
    "colour": 180,
    
  },

  {
    "name": "Tabs",
    fields: [
      {
        "type": "slot",
        "name": "tabList"
      },
      {
        "type": "slot",
        "name": "tabPanels"
      }
    ],
    "colour": 80,
    
    },
   
    {
      "name": "TabPanel",
      fields: [
        {
          "type": "slot",
          "name": "default"
        },
        {
          "type": "string",
          "name": "path"
        }
      ],
      "colour": 80,
    },

    {  
      "name": "Tab",
      fields: [
        {
          "type": "string",
          "name": "label",
          "defaultValue": "default"
        }
      ],
      "colour": 80,
    },

    {
      "name": "Theming",
      fields: [
        {
          "type": "string",
          "name": "cssFile",
          "defaultValue": "global.css"
        },
        {
          "type": "string",
          "name": "jsFile",
          "defaultValue": "custom.js"
        }
      ],
      "colour": 0,
    },

    {
      "name": "MapCategoryFilter",
      fields: [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "categoryNameColumn",
          "type": "sheetColumn",
          "columnType": "string",
          "defaultValue": "categories/name"
        },
        {
          "name": "categoryColorColumn",
          "type": "sheetColumn",
          "columnType": "string",
          "defaultValue": "categories/color"
        },
        {
          "name": "elementRefColumn",
          "type": "sheetColumn",
          "columnType": "sheetRef",
          "refKey": "categories",
          "defaultValue": "elements/category"
        },
        {
          "name": "categoryUnlistedColumn",
          "type": "sheetColumn",
          "columnType": "string",
          "defaultValue": "categories/unlisted"
        },
        {
          "name": "categoryOrderColumn",
          "type": "sheetColumn",
          "columnType": "number",
          "defaultValue": "categories/order"
        },
        {
          "name": "filterKeyColumn",
          "type": "sheetColumn",
          "columnType": "string",
          "defaultValue": "categories/filterKey"
        },
        {
          "name": "connectedLayerKeyColumn",
          "type": "sheetColumn",
          "columnType": "string",
          "defaultValue": "categories/connectedLayerKey"
        },
      ],
      "colour": 230
    },

    {
      "name": "MapLayer",
      fields: [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "assetPath",
          "type": "string"
        },
        {
          "name": "topLeft",
          "type": "string"
        },
        {
          "name": "bottomRight",
          "type": "string"
        },
        {
          "name": "audio",
          "type": "string"
        },
        {
          "name": "hideLabels",
          "type": "checkbox"
        },
        {
          "name": "layerKey",
          "type": "string"
        },
        {
          "name": "connectedFilterKey",
          "type": "string"
        },
        {
          "name": "hideMarkers",
          "type": "checkbox"
        },
        
      ],
      "colour": 230,
      "tooltip": "Filter the markers on the map"
    },


    {
      "name": "TopNav",
      fields: [
        {
          "type": "string",
          "name": "label",
          "defaultValue": "Einstellungen"
        },
        {
        "type": "slot",
        "name": "default"
        } 
      ],
      "colour": 90,
      "tooltip": "Add a button on the top right with access to a special page (eg for settings)"
    },

    {
      "name": "Subsections",
      fields: [
        {
        "type": "slot",
        "name": "default"
        } 
      ],
      "colour": 90
    },

     {
      "name": "Subsection",
      fields: [
        {
          "type": "string",
          "name": "title"
        },
        {
        "type": "slot",
        "name": "default"
        } 
      ],
      "colour": 90,
    },

    {
      "name": "DynamicContent",
      fields: [
        {
          "type": "sheetColumn",
          "name": "keyColumn",
          "columnType": "string",
          "defaultValue": "settings/contentKey"
        },
        {
          "type": "sheetColumn",
          "name": "contentColumn",
          "columnType": "richText",
          "defaultValue": "settings/content"
        },
        {
          "type": "string",
          "name": "contentKey"
        },
        {
          "type": "string",
          "name": "format",
          "defaultValue": "richText"
        },
        
      ],
      "colour": 230,
    }

  ]

  return blockObjects;
}
