<script>

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'

  import ElementSlider from './ElementSlider.svelte';
  import ElementRandom from './ElementRandom.svelte';
  import ElementNearest from './ElementNearest.svelte';
  import FeaturedCategory from './FeaturedCategory.svelte';
  import MenuSwitcher from './MenuSwitcher.svelte';
  import CategorySlider from './CategorySlider.svelte';

  let projectId = INTERKIT_PROJECT_ID;

  // columns for the sections of the dashboard
  export let sectionTitles; // column of the section title
  export let sectionRefs; // column of references to elements
  export let sectionCategoryRef; // column of references to the primary category
  export let sectionCategory2Ref; // column of references to the secondary category
  export let sectionTypes; // column that tells us which component to use per section
  export let sectionImage; // column that gives us an image for the section
  export let sectionOrder; // column that tells us in which order the sections should be rendered

  const sectionColumns = {
    titleColumn: sectionTitles,
    elementRefsColumn: sectionRefs,
    categoryRefsColumn: [sectionCategoryRef, sectionCategory2Ref],
    typeColumn: sectionTypes,
    imageColumn: sectionImage,
    orderColumn: sectionOrder
  }

  // columns for the individual elements eg in sliders
  export let elementTitleColumn;
  export let elementDescriptionColumn;
  export let elementAudioColumn;
  export let elementImageColumn;
  export let elementCategoryRefColumn;  
  export let elementCategory2RefColumn;  
  export let elementCategoryOrderColumn;
  export let elementCategory2OrderColumn;
  export let elementLocationColumn;

  const elementColumns = {
    titleColumn: elementTitleColumn,
    descriptionColumn: elementDescriptionColumn,
    audioColumn: elementAudioColumn,
    imageColumn: elementImageColumn,
    categoryRefColumn: [elementCategoryRefColumn, elementCategory2RefColumn], 
    categoryOrderColumn: [elementCategoryOrderColumn, elementCategory2OrderColumn],
    locationColumn: elementLocationColumn,    
  }

  // columns for the primary category
  export let categoryTitleColumn;
  export let categorySubtitleColumn;
  export let categoryDescriptionColumn;
  export let categoryImageColumn;

  // columns for the secondary category
  export let category2TitleColumn;
  export let category2SubtitleColumn;
  export let category2DescriptionColumn;
  export let category2ImageColumn;

  const categoryColumns = [{
    titleColumn: categoryTitleColumn,
    subtitleColumn: categorySubtitleColumn,
    descriptionColumn: categoryDescriptionColumn,
    imageColumn: categoryImageColumn,
  }, {
    titleColumn: category2TitleColumn,
    subtitleColumn: category2SubtitleColumn,
    descriptionColumn: category2DescriptionColumn,
    imageColumn: category2ImageColumn,
  }]

  let sectionSheetKey = util.getSheetKey(sectionTitles) // key of the sheet with the dashboard structure  

  let refsColumnKey = util.colKey(sectionRefs) // column of the element references

  let sectionSub; // sub to the dashboard structure sheet
  let sectionRows; // the rows from the sheet that specify the dashboard structure
  
  if(sectionSheetKey != util.getSheetKey(sectionRefs))
    alert("bad config: sectionTitles and sectionRefs must be from same sheet")

  let elementSheetKey; // the key of the sheet containing the elements
  let elementSub;
  let elementRows = [];
    
  onMount(async ()=>{

    if(sectionSheetKey) {
      sectionSub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: sectionSheetKey, projectId}], r=>r.sheetKey==sectionSheetKey);
      sectionRows = sectionSub.data;
    }

    // this is the row subscription that powers all the sub components of dashboard
    if(elementTitleColumn) {  
      elementSheetKey = util.getSheetKey(elementTitleColumn);
      elementSub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: elementSheetKey, projectId}], r=>r.sheetKey==elementSheetKey);
      elementSub.data.subscribe(data=>{
        elementRows = data;
        //console.log("elementRows update", elementRows)
      })
    }
  })

  // todo: onDestroy

  const sort = (r1, r2) => {
    if (util.rowVal(r1, sectionOrder) < util.rowVal(r2, sectionOrder)) {
      return -1;
    }
    if (util.rowVal(r1, sectionOrder) > util.rowVal(r2, sectionOrder)) {
      return 1;
    }
    return 0;
  }

  $: sections = $sectionRows ? [...$sectionRows].sort(sort).map(r=>{return {
    type: util.rowVal(r, sectionTypes),
    title: util.rowVal(r, sectionTitles), 
    refs: util.rowVal(r, sectionRefs),
    image: util.rowVal(r, sectionImage),
    sectionRow: r  
  }}) : []

</script>

<div class="dashboard-container">

<h1>Dashboard</h1>

{#each sections as section}

  <!--{JSON.stringify(section)}-->

  {#if section.type == "ElementSlider"}
    <ElementSlider 
      title={section.title}
      elementRows={elementRows.filter(r=>section.refs?.rowKeys.includes(r.key))}
      {elementColumns}
      {categoryColumns}
    />
  {:else if section.type == "ElementNearest"}
    <ElementNearest
      title={section.title}
      {elementRows}
      {elementColumns}
      {categoryColumns}
    />
  {:else if section.type == "ElementRandom"}
    <ElementRandom
      title={section.title}
      image={section.image}
      {elementRows}
      {elementColumns}
    />
  
  {:else if section.type == "CategorySlider"}

    <CategorySlider
      title={section.title}
      sectionRow={section.sectionRow}
      {sectionColumns}
      {elementColumns}
      {elementRows}
      {categoryColumns}
    />

  {:else if section.type == "FeaturedCategory"}

    <FeaturedCategory
      title={section.title}
      sectionRow={section.sectionRow}
      {sectionColumns}
      {categoryColumns}
    />


  {:else if section.type == "MenuSwitcher"}

    <MenuSwitcher
      title={section.title}
      image={section.image}
    />

  {:else}
    <div>Dashboard Component {section.type} not implenented yet.</div>
  {/if}

{/each}

</div>


<style>
  h1 {
    font-family: var(--font-family);
    color: var(--color-primary);
  }

  .dashboard-container {
    justify-content: normal;
  }

  
</style>