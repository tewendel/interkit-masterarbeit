<script>

  export let sectionTitles; // column of the section title
  export let sectionRefs;
  export let sectionTypes; // column that tells us which component to use per section

  export let elementTitleColumn;
  export let elementDescriptionColumn;
  export let elementAudioColumn;
  export let elementImageColumn;

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient, util } from '../'

  import ElementSlider from './ElementSlider.svelte';
  import ElementSingle from './ElementSingle.svelte';
  import ElementRandom from './ElementRandom.svelte';

  let sectionSheetId = sectionTitles?.split("/")?.[0] // id of the sheet with the dashboard structure  
  let refsColumnKey = util.colKey(sectionRefs) // column of the element references

  let sectionSub; // sub to the dashboard structure sheet
  let sectionRows; // the rows from the sheet that specify the dashboard structure
  
  if(sectionSheetId != sectionRefs?.split("/")?.[0])
    alert("bad config: sectionTitles and sectionRefs must be from same sheet")

  let referenceSheetId; // is of the sheet containing the elements
  let elementSub;
  let elementRows = [];
    
  onMount(async ()=>{

    if(sectionSheetId) {
      sectionSub = await InterkitClient.getSub('rows', 'rows', [sectionSheetId], r=>r.sheetId==sectionSheetId);
      sectionRows = sectionSub.data;
      console.log("sectionRows", $sectionRows)

      if(refsColumnKey) {

        // for now we assume all references are to the same sheet!
        let aRefRow = $sectionRows.find(r => r.value?.[refsColumnKey]?.sheetId)
        console.log(aRefRow)

        if(!aRefRow) {
          console.log("dashboard empty: no element selected in reference column, aborting subscribe")
          return
        }

        referenceSheetId = aRefRow.value[refsColumnKey].sheetId;

        //console.log("referenceSheetId", referenceSheetId)

        elementSub = await InterkitClient.getSub('rows', 'rows', [referenceSheetId], r=>r.sheetId==referenceSheetId);
        elementSub.data.subscribe(data=>{
          elementRows = data;
        })

        //console.log(elementRows)
      }
    }
  })

  // todo: onDestroy

  $: sections = $sectionRows ? $sectionRows.map(r=>{return {
    title: util.rowVal(r, sectionTitles), 
    refs: util.rowVal(r, sectionRefs),
    type: util.rowVal(r, sectionTypes)
  }}) : []

</script>

<div class="dashboard-container">

<h1>Dashboard</h1>

{#each sections as section}

  {#if section.type == "ElementSlider"}
    <ElementSlider 
      title={section.title}
      elementRows={elementRows.filter(r=>section.refs?.rowIds.includes(r._id))}
      titleColumn={elementTitleColumn}
      descriptionColumn={elementDescriptionColumn}
      audioColumn={elementAudioColumn}
      imageColumn={elementImageColumn}
    />
  {:else if section.type == "ElementSingle"}
    <ElementSingle
      elementRow={elementRows.find(r=>section.refs?.rowIds[0] == r._id)}
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
    />
  {:else if section.type == "FeaturedCategory"}

    <!--
        FeaturedCategory would have to
        - access the BottomMenuContext 
          - should be ok, we are child component of BottomMenu
        - switch to a specific MenuPage ("podcasts")
          - problem: how to configure? maybe via the label

        - access the Tabs context 
          - problem: we are not a child component of Tabs
          - problem: which Tab context?
        - switch to a specific Tab
          - problem: how to configure which tab?

        - access the ListNav context
          - problem: we are not a child component of ListNav
          - problem: which ListNav?
        - select the single view for a specific list element (the category)
    -->

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
    padding-bottom: 100px;
  }

  
</style>