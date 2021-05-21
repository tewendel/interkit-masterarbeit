<script>

  import { InterkitClient, util } from '../'
  import { get } from 'svelte/store'
  
  export let elementKey;

  const bookmarkStore = InterkitClient.getGlobalStore("elementProperties")
  
  const addBookmark = (key) => {
    InterkitClient.setElementProperty(bookmarkStore, key, "bookmarked", true)
  }
  
  const removeBookmark = (key) => {
    //console.log("removeBookmark", get(bookmarkStore))
    InterkitClient.setElementProperty(bookmarkStore, key, "bookmarked", false)
  }

  $: isBookmarked = $bookmarkStore ? $bookmarkStore?.[elementKey]?.bookmarked : false
  
  const toggleBookmark = () => {
    if(isBookmarked) 
      removeBookmark(elementKey)
    else
      addBookmark(elementKey)
  }

</script>

<span on:click={toggleBookmark}>
  {#if isBookmarked}
    GEMERKT
  {:else}
    MERKEN
  {/if}
</span>

<style>
  span:hover {
    cursor: pointer;
  }
</style>