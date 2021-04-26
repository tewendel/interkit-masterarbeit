<script>
  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import ElementSlider from './ElementSlider.svelte'

  let projectId = INTERKIT_PROJECT_ID;

  export let title;
  export let sectionRow;
  export let sectionColumns;
  export let elementRows;
  export let elementColumns;
  export let categoryColumns;

  // select the categories to use
  let categoryIndex = util.getCategoryIndex(sectionRow, sectionColumns);

  // the rowKey of the category we want to display
  let sectionCategoryKey = util.rowVal(sectionRow, sectionColumns.categoryRefsColumn[categoryIndex])?.rowKeys?.[0]
  
  // the columnKey of the element sheet that references the category
  let elementCategoryRefColumnKey = util.colKey(elementColumns.categoryRefColumn[categoryIndex])

  let categoryTitle;  
  onMount(async ()=>{
    let categoryRow = await InterkitClient.call("row.get", {key: sectionCategoryKey, projectId})
    //console.log(categoryRow)
    categoryTitle = util.rowVal(categoryRow, categoryColumns[categoryIndex].titleColumn)
  })

  // determine if an element row contains a reference to the category we want to filter for
  const filter = (dataRow) => {
    return dataRow?.values?.[elementCategoryRefColumnKey]?.rowKeys?.includes(sectionCategoryKey)
  }
  $: elementRows_filtered = elementRows.filter(filter);

</script>

<ElementSlider 
      title={categoryTitle}
      elementRows={elementRows_filtered}
      {elementColumns}
      {categoryColumns}
      {categoryIndex}
/>