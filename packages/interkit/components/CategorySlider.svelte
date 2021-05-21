<script>
  import { onMount } from 'svelte'
  import { InterkitClient, util } from '../'
  import ElementSlider from './ElementSlider.svelte'

  export let title;
  export let sectionRow;
  export let sectionColumns;
  export let elementRows;
  export let elementColumns;
  export let categoryColumns;
  export let special = false; // true option used for events slider in GATE project

  // select the categories to use
  let categoryIndex = util.getCategoryIndex(sectionRow, sectionColumns);

  // the rowKey of the category we want to display
  let sectionCategoryKey = util.rowVal(sectionRow, sectionColumns.categoryRefsColumn[categoryIndex])?.rowKeys?.[0]
  
  // the columnKey of the element sheet that references the category
  let elementCategoryRefColumnKey = util.colKey(elementColumns.categoryRefColumn[categoryIndex])

  let categoryRowStore;
  let categoryRow; // the row of the category that is referenced
  let categoryTitle;  

  const updateCategoryTitle = async (sCKey)=>{
    let categorySheetKey = util.getSheetKey(categoryColumns[categoryIndex].titleColumn)
    categoryRowStore = await InterkitClient.getRowSubStore(categorySheetKey);
    categoryRow = $categoryRowStore.find(r => r.key == sCKey)
    categoryTitle = util.rowVal(categoryRow, categoryColumns[categoryIndex].titleColumn)
  }

  // determine if an element row contains a reference to the category we want to filter for
  const filter = (dataRow) => {
    return dataRow?.values?.[elementCategoryRefColumnKey]?.rowKeys?.includes(sectionCategoryKey)
  }
  
  $: updateCategoryTitle(sectionCategoryKey)
  $: elementRows_filtered = elementRows.filter(filter);



</script>

<ElementSlider 
      title={title || categoryTitle}
      elementRows={elementRows_filtered}
      {elementColumns}
      {categoryColumns}
      {categoryIndex}
      {special}
/>