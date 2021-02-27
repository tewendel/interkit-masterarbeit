<script>

  import config from './Archive.yml'
  import ArchiveCategory from './ArchiveCategory.svelte'
  import ArchiveList from './ArchiveList.svelte'

  let selectedCategory

  const openCategory = (category) => {
    //console.log(category)
    selectedCategory = category;
  }

</script>

<div style="justify-content: normal">

<h1>Archive</h1>

{#if !selectedCategory}

  {#if config.categorySheet1.value}
  <ArchiveCategory
    categorySheetId={config.categorySheet1.value.split("/")[0]}
    categoryColumnKey={config.categorySheet1.value.split("/")[1]}
    {openCategory}
  />
  {/if}

  {#if config.categorySheet2.value}
  <ArchiveCategory
    categorySheetId={config.categorySheet2.value.split("/")[0]}
    categoryColumnKey={config.categorySheet2.value.split("/")[1]}
    {openCategory}
  />
  {/if}

{/if}

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
</style>