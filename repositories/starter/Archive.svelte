<script>

  import { onMount } from 'svelte'
  
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import "carbon-components-svelte/css/g10.css"; // all g10 g100 g90 white

  import { InterkitClient } from 'interkit-shared'
  import config from './Archive.yml'
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
    categorySheet1 = await getSheet(config.categorySheet1.value)
    categorySheet2 = await getSheet(config.categorySheet2.value)
  })

</script>

<div style="justify-content: normal">

<h1>Archive</h1>

  <div class:hide={selectedCategory != null}>

  <Tabs>
    {#if categorySheet1}<Tab label={categorySheet1.name}/>{/if}
    {#if categorySheet2}<Tab label={categorySheet2.name}/>{/if}
    <div slot="content">
      {#if categorySheet1}
      <TabContent>
        <ArchiveCategory
          categorySheet={categorySheet1}
          categoryColumnKey={config.categorySheet1.value.split("/")[1]}
          {openCategory}
        />
      </TabContent>
      {/if}
      {#if categorySheet2}
      <TabContent>
        <ArchiveCategory
          categorySheet={categorySheet2}
          categoryColumnKey={config.categorySheet2.value.split("/")[1]}
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
    dataSheetId={config.dataSheet.value.split("/")[0]}
    dataSheetColumnKey={config.dataSheet.value.split("/")[1]}
    close={()=>{selectedCategory = null}}
  />
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