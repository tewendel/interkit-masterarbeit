<script>

  // columns for the sections of the dashboard
  export let sectionTitles; // column of the section title
  export let sectionRefs; // column of references to elements
  export let sectionCategoryRef; // column of references to the primary category
  export let sectionCategory2Ref; // column of references to the secondary category
  export let sectionTypes; // column that tells us which component to use per section
  export let sectionImage; // column that gives us an image for the section
  export let sectionOrder; // column that tells us in which order the sections should be rendered

  // columns for the individual elements eg in sliders
  export let elementTitleColumn;
  export let elementDescriptionColumn;
  export let elementAudioColumn;
  export let elementImageColumn;
  export let elementCategoryRefColumn;  
  export let elementCategory2RefColumn;  

  // columns for the primary category
  export let categoryTitleColumn;
  export let categoryDescriptionColumn;
  export let categoryImageColumn;

  // columns for the secondary category
  export let category2TitleColumn;
  export let category2DescriptionColumn;
  export let category2ImageColumn;

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'

  import ElementSlider from './ElementSlider.svelte';
  import ElementSingle from './ElementSingle.svelte';
  import ElementRandom from './ElementRandom.svelte';
  import FeaturedCategory from './FeaturedCategory.svelte';
  import MenuSwitcher from './MenuSwitcher.svelte';
  import CategorySlider from './CategorySlider.svelte';

  let projectId = INTERKIT_PROJECT_ID;

  let sectionSheetKey = util.getSheetKey(sectionTitles) // key of the sheet with the dashboard structure  

  let refsColumnKey = util.colKey(sectionRefs) // column of the element references

  let sectionSub; // sub to the dashboard structure sheet
  let sectionRows; // the rows from the sheet that specify the dashboard structure
  
  if(sectionSheetKey != util.getSheetKey(sectionRefs))
    alert("bad config: sectionTitles and sectionRefs must be from same sheet")

  let referenceSheetKey; // is of the sheet containing the elements
  let elementSub;
  let elementRows = [];
    
  onMount(async ()=>{

    if(sectionSheetKey) {
      sectionSub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: sectionSheetKey, projectId}], r=>r.sheetKey==sectionSheetKey);
      sectionRows = sectionSub.data;
      //console.log("sectionRows", $sectionRows)

      if(refsColumnKey) {

        // for now we assume all references are to the same sheet!
        let aRefRow = $sectionRows.find(r => r.values?.[refsColumnKey]?.sheetKey)
        //console.log(aRefRow)

        if(!aRefRow) {
          console.log("dashboard empty: no element selected in reference column, aborting auto-subscribe to elements")
          return
        }

        referenceSheetKey = aRefRow.values[refsColumnKey].sheetKey;

        //console.log("referenceSheetId", referenceSheetId)

        elementSub = await InterkitClient.getSub('rows', 'rows', [{sheetKey: referenceSheetKey, projectId}], r=>r.sheetKey==referenceSheetKey);
        elementSub.data.subscribe(data=>{
          elementRows = data;
        })

        //console.log(elementRows)
      }
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

  $: sections = $sectionRows ? $sectionRows.sort(sort).map(r=>{return {
    title: util.rowVal(r, sectionTitles), 
    refs: util.rowVal(r, sectionRefs),
    type: util.rowVal(r, sectionTypes),
    categoryRef: util.rowVal(r, sectionCategoryRef),
    category2Ref: util.rowVal(r, sectionCategory2Ref),
    image: util.rowVal(r, sectionImage)
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
      titleColumn={elementTitleColumn}
      descriptionColumn={elementDescriptionColumn}
      audioColumn={elementAudioColumn}
      imageColumn={elementImageColumn}
    />
  {:else if section.type == "ElementSingle"}
    <ElementSingle
      elementRow={elementRows.find(r=>section.refs?.rowKeys[0] == r.key)}
      titleColumn={elementTitleColumn}
      descriptionColumn={elementDescriptionColumn}
      audioColumn={elementAudioColumn}
    />
  {:else if section.type == "ElementRandom"}
    <ElementRandom
      {elementRows}
      titleColumn={elementTitleColumn}
      descriptionColumn={elementDescriptionColumn}
      audioColumn={elementAudioColumn}
      image={section.image}
      title={section.title}
    />
  {:else if section.type == "FeaturedCategory"}

    <FeaturedCategory
      title={section.title}
      categoryRef={section.categoryRef}
      {categoryTitleColumn}
      {categoryDescriptionColumn}
      {categoryImageColumn}
    />

  {:else if section.type == "CategorySlider"}

    <CategorySlider
      title={section.title}
      categoryRef={section.categoryRef}
      category2Ref={section.category2Ref}
      {categoryTitleColumn}
      {categoryDescriptionColumn}
      {categoryImageColumn}
      {category2TitleColumn}
      {category2DescriptionColumn}
      {category2ImageColumn}
      {elementTitleColumn}
      {elementDescriptionColumn}
      {elementAudioColumn}
      {elementImageColumn}
      {elementCategoryRefColumn}
      {elementCategory2RefColumn}
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