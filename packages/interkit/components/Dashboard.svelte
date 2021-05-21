<script>

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'

  import ElementSlider from './ElementSlider.svelte';
  import ElementRandom from './ElementRandom.svelte';
  import ElementNearest from './ElementNearest.svelte';
  import FeaturedCategory from './FeaturedCategory.svelte';
  import MenuSwitcher from './MenuSwitcher.svelte';
  import CategorySlider from './CategorySlider.svelte';
  import ContentElementAudio from './ContentElementAudio.svelte';
  
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
  export let elementSupertextColumn;
  export let elementShortDescriptionColumn;
  export let elementDescriptionColumn;
  export let elementAudioColumn;
  export let elementImageColumn;
  export let elementCategoryRefColumn;  
  export let elementCategory2RefColumn;  
  export let elementCategoryOrderColumn;
  export let elementCategory2OrderColumn;
  export let elementLocationColumn;
  export let elementLinkColumn;

  const elementColumns = {
    titleColumn: elementTitleColumn,
    supertextColumn: elementSupertextColumn,
    descriptionColumn: elementDescriptionColumn,
    shortDescriptionColumn: elementShortDescriptionColumn,
    audioColumn: elementAudioColumn,
    imageColumn: elementImageColumn,
    categoryRefColumn: [elementCategoryRefColumn, elementCategory2RefColumn], 
    categoryOrderColumn: [elementCategoryOrderColumn, elementCategory2OrderColumn],
    locationColumn: elementLocationColumn,    
    linkColumn: elementLinkColumn
  }

  console.log("dashboard elementColumns", elementColumns)

  // columns for the primary category
  export let categoryTitleColumn;
  export let categorySubtitleColumn;
  export let categoryDescriptionColumn;
  export let categoryImageColumn;
  export let categoryUnlistedColumn;

  // columns for the secondary category
  export let category2TitleColumn;
  export let category2SubtitleColumn;
  export let category2DescriptionColumn;
  export let category2ImageColumn;
  export let category2UnlistedColumn;

  const categoryColumns = [{
    titleColumn: categoryTitleColumn,
    subtitleColumn: categorySubtitleColumn,
    descriptionColumn: categoryDescriptionColumn,
    imageColumn: categoryImageColumn,
    unlistedColumn: categoryUnlistedColumn
  }, {
    titleColumn: category2TitleColumn,
    subtitleColumn: category2SubtitleColumn,
    descriptionColumn: category2DescriptionColumn,
    imageColumn: category2ImageColumn,
    unlistedColumn: categoryUnlistedColumn
  }]

  let sectionSheetKey = util.getSheetKey(sectionTitles) // key of the sheet with the dashboard structure  

  let refsColumnKey = util.colKey(sectionRefs) // column of the element references

  let sectionRows; // store with the rows from the sheet that specify the dashboard structure
  
  if(sectionSheetKey != util.getSheetKey(sectionRefs))
    alert("bad config: sectionTitles and sectionRefs must be from same sheet")

  let elementSheetKey; // the key of the sheet containing the elements
  let elementRows; // store with the elements
    
  onMount(async ()=>{

    if(sectionSheetKey) {
      sectionRows = await InterkitClient.getRowSubStore(sectionSheetKey);
    }

    // this is the row subscription that powers all the sub components of dashboard
    if(elementTitleColumn) {  
      elementSheetKey = util.getSheetKey(elementTitleColumn);
      elementRows = await InterkitClient.getRowSubStore(elementSheetKey);
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
    title: util.rowValString(r, sectionTitles), 
    refs: util.rowVal(r, sectionRefs),
    image: util.rowVal(r, sectionImage),
    sectionRow: r  
  }}) : []

</script>

<div class="dashboard-container">

{#if $elementRows && sections}
  {#each sections as section}

    <!--{JSON.stringify(section)}-->

    {#if section.type == "ElementSingle"}
    <ContentElementAudio
      size="xs"
      element={($elementRows?.filter(r=>section.refs?.rowKeys.includes(r.key))?.[0])}
      {elementColumns}
      {categoryColumns}
    />
    {:else if section.type == "ElementSlider"}
      <ElementSlider 
        title={section.title}
        elementRows={$elementRows?.filter(r=>section.refs?.rowKeys.includes(r.key))}
        {elementColumns}
        {categoryColumns}
      />
    {:else if section.type == "ElementNearest"}
      <ElementNearest
        title={section.title}
        elementRows={$elementRows}
        {elementColumns}
        {categoryColumns}
      />
    {:else if section.type == "ElementRandom"}
      <ElementRandom
        title={section.title}
        image={section.image}
        elementRows={$elementRows}
        {elementColumns}
      />
    
    {:else if section.type == "CategorySlider"}

      <CategorySlider
        title={section.title}
        sectionRow={section.sectionRow}
        {sectionColumns}
        {elementColumns}
        elementRows={$elementRows}
        {categoryColumns}
      />

    {:else if section.type == "CategorySliderSpecial"}

      <CategorySlider
        title={section.title}
        sectionRow={section.sectionRow}
        {sectionColumns}
        {elementColumns}
        elementRows={$elementRows}
        {categoryColumns}
        special
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
{/if}

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