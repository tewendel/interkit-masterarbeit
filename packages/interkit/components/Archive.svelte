<script>

  import { onMount } from 'svelte'
  
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import "carbon-components-svelte/css/g10.css"; // all g10 g100 g90 white

  import { InterkitClient } from '../'
  
  export let dataSheet // type sheetColumn
  export let categorySheet1 // type sheetColumn
  export let categorySheet2 // type sheetColumn

  import ArchiveCategory from './ArchiveCategory.svelte'
  import ArchiveList from './ArchiveList.svelte'

  let selectedCategory = null
  
  const openCategory = (category) => {
    //console.log(category)
    selectedCategory = category;
  }

  const getSheet = async (sheetColumn) => {
    let sheet;
    if(sheetColumn) {
      sheet = await InterkitClient.call('sheet.get', sheetColumn.split("/")[0])
      //console.log(sheet)
    }
    return sheet;
  }

  let categorySheetObj1;
  let categorySheetObj2;
  onMount(async ()=>{
    console.log("archive" + (typeof categorySheet1) + (typeof categorySheet2))

    categorySheetObj1 = await getSheet(categorySheet1)
    categorySheetObj2 = await getSheet(categorySheet2)
    //console.log(categorySheetObj1)
  })

</script>

<div style="justify-content: normal">

<h1>Archive</h1>

{#if categorySheet1 || categorySheet2}

  <div class:hide={selectedCategory != null}>

  <Tabs>
    {#if categorySheetObj1}<Tab label={categorySheetObj1.name}/>{/if}
    {#if categorySheetObj2}<Tab label={categorySheetObj2.name}/>{/if}
    <div slot="content">
      {#if categorySheetObj1}
      <TabContent>
        <ArchiveCategory
          categorySheet={categorySheetObj1}
          categoryColumnKey={categorySheet1.split("/")[1]}
          {openCategory}
        />
      </TabContent>
      {/if}
      {#if categorySheetObj2}
      <TabContent>
        <ArchiveCategory
          categorySheet={categorySheetObj2}
          categoryColumnKey={categorySheet2.split("/")[1]}
          {openCategory}
        />
      </TabContent>
      {/if}    
    </div>
  </Tabs>  

  </div>

  {#if selectedCategory}
  <ArchiveList
    category={selectedCategory.row}
    categoryName={selectedCategory.name}
    dataSheetId={categorySheet1.split("/")[0]}
    dataSheetColumnKey={dataSheet.split("/")[1]}
    close={()=>{selectedCategory = null}}
  />
  {/if}

{:else}
  
  {#if dataSheet}
    <ArchiveList
      dataSheetId={dataSheet.split("/")[0]}
      dataSheetColumnKey={dataSheet.split("/")[1]}
    />
  {/if}

{/if}

</div>

<style>
  h1 {
    font-family: var(--font-family);
    color: var(--color-primary);
  }
  .hide {
    display: none;
  }
</style>