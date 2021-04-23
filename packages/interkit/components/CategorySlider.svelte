<script>

  import { InterkitClient, util } from '../'
  import ElementSlider from './ElementSlider.svelte'

  export let title
  export let categoryRef
  export let categoryTitleColumn
  export let categorySubtitleColumn
  export let categoryDescriptionColumn
  export let categoryImageColumn
  export let category2Ref
  export let category2TitleColumn
  export let category2SubtitleColumn
  export let category2DescriptionColumn
  export let category2ImageColumn

  export let elementTitleColumn
  export let elementAudioColumn
  export let elementImageColumn
  export let elementDescriptionColumn
  export let elementCategoryRefColumn
  export let elementCategory2RefColumn

  export let elementCategoryOrderColumn
  export let elementCategory2OrderColumn

  import { onMount } from 'svelte'

  let projectId = INTERKIT_PROJECT_ID;

  // get element rows
  // select the categories to use
  let primary = categoryRef ? true : false

  // the rowKey of the category we want to display
  let sectionCategoryKey = primary ? categoryRef?.rowKeys?.[0] : category2Ref?.rowKeys?.[0]
  
  // the sheetKey of the elements we want to choose from
  let elementSheetKey = util.getSheetKey(elementTitleColumn)
  
  // the columnKey of the element sheet that references the category
  let elementCategoryRefColumnKey = util.colKey(primary ? elementCategoryRefColumn : elementCategory2RefColumn)

  let elementCategoryRefColumSelected = primary ? elementCategoryRefColumn : elementCategory2RefColumn; 
  let elementCategoryOrderColumnSelected = primary ? elementCategoryOrderColumn : elementCategory2OrderColumn;
  let categoryTitleColumnSelected = primary ? categoryTitleColumn : category2TitleColumn;
  let categorySubtitleColumnSelected = primary ? categorySubtitleColumn : category2SubtitleColumn;

  console.log("category 2", 
    elementCategory2RefColumn, 
    elementCategory2OrderColumn, 
    category2TitleColumn, 
    category2SubtitleColumn
  )

  console.log("select the right category", 
    elementCategoryRefColumSelected, 
    elementCategoryOrderColumnSelected, 
    categoryTitleColumnSelected, 
    categorySubtitleColumnSelected
  )

  let categoryTitle;
  let elementSub;
  let elementRows;

  // determine if an element row contains a reference to the category we want to filter for
  const filter = (dataRow) => {
    return dataRow?.values?.[elementCategoryRefColumnKey]?.rowKeys?.includes(sectionCategoryKey)
  }

  onMount(async ()=>{
    elementSub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: elementSheetKey, projectId}], r=>{return (r.sheetKey==elementSheetKey) && filter(r)});
    elementRows = elementSub.data;  
    console.log("elementRows", $elementRows)

    let categoryRow = await InterkitClient.call("row.get", {key: sectionCategoryKey, projectId})
    console.log(categoryRow)
    categoryTitle = util.rowVal(categoryRow, categoryTitleColumn)
  })

  

</script>

<ElementSlider 
      title={categoryTitle}
      elementRows={$elementRows}
      titleColumn={elementTitleColumn}
      descriptionColumn={elementDescriptionColumn}
      audioColumn={elementAudioColumn}
      imageColumn={elementImageColumn}
      categoryRefColumn={elementCategoryRefColumSelected}
      categoryOrderColumn={elementCategoryOrderColumnSelected}
      categoryTitleColumn={categoryTitleColumnSelected}
      categorySubtitleColumn={categorySubtitleColumnSelected}
/>