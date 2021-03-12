<script>

  import { onMount } from 'svelte'
  
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import "carbon-components-svelte/css/g10.css"; // all g10 g100 g90 white

  import { InterkitClient } from '../'
  
  export let data_sheet // type sheetColumn
  export let category_sheet1 // type sheetColumn
  export let category_sheet2 // type sheetColumn

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
    }
    return sheet;
  }

  let categorySheet1;
  let categorySheet2;
  onMount(async ()=>{
    categorySheet1 = await getSheet(category_sheet1)
    categorySheet2 = await getSheet(category_sheet2)
  })

</script>

<div style="justify-content: normal">

<h1>Archive</h1>

{#if category_sheet1 || category_sheet2}

  <div class:hide={selectedCategory != null}>

  <Tabs>
    {#if categorySheet1}<Tab label={categorySheet1.name}/>{/if}
    {#if categorySheet2}<Tab label={categorySheet2.name}/>{/if}
    <div slot="content">
      {#if categorySheet1}
      <TabContent>
        <ArchiveCategory
          categorySheet={categorySheet1}
          categoryColumnKey={category_sheet1.split("/")[1]}
          {openCategory}
        />
      </TabContent>
      {/if}
      {#if categorySheet2}
      <TabContent>
        <ArchiveCategory
          categorySheet={categorySheet2}
          categoryColumnKey={category_sheet2.split("/")[1]}
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
    dataSheetId={category_sheet1.split("/")[0]}
    dataSheetColumnKey={data_sheet.split("/")[1]}
    close={()=>{selectedCategory = null}}
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