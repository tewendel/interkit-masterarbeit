<script>

  export let sectionTitles;
  export let sectionRefs;

  import { onMount, onDestroy } from 'svelte'
  import { InterkitClient } from 'interkit'

  let sectionSub;
  let sectionRows;
  let sectionSheetId = sectionTitles?.split("/")?.[0]
  let titleColumKey = sectionTitles?.split("/")?.[1]
  let refsColumnKey = sectionRefs?.split("/")?.[1]

  if(sectionSheetId != sectionRefs?.split("/")?.[0])
    alert("bad config: sectionTitles and sectionRegs must be from same sheet")

  let referenceSheetId;
  let elementSub;
  let elementRows = [];
    
  onMount(async ()=>{
    sectionSub = await InterkitClient.getSub('rows', 'rows', [sectionSheetId], r=>r.sheetId==sectionSheetId);
    sectionRows = sectionSub.data;
    console.log($sectionRows)

    // for now we assume all references are to the same sheet!
    let aRefRow = $sectionRows.find(r => r.value?.[refsColumnKey]?.sheetId)
    console.log(aRefRow)

    referenceSheetId = aRefRow.value[refsColumnKey].sheetId;

    console.log("referenceSheetId", referenceSheetId)

    elementSub = await InterkitClient.getSub('rows', 'rows', [referenceSheetId], r=>r.sheetId==referenceSheetId);
    elementSub.data.subscribe(data=>{
      elementRows = data;
    })

    console.log(elementRows)
  })

  // todo: onDestroy

  $: sections = $sectionRows ? $sectionRows.map(r=>{return {title: r.value[titleColumKey], refs: r.value[refsColumnKey]}}) : []

</script>

<div style="justify-content: normal">

<h1>Dashboard</h1>

{#each sections as section}

  <h2>{section.title}</h2>

  {#if section?.refs}
  <ul>
    {#each section.refs?.rowIds as elementId}
      <li>{elementRows.find(r=>r.id==elementId)?.value[section.refs.columnKey]}</li>
    {/each}
  </ul>
  {/if}

{/each}

</div>


<style>
  h1 {
    font-family: var(--font-family);
    color: var(--color-primary);
  }
</style>