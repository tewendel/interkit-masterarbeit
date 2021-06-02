<script>

  import { InterkitClient, util } from '../'
  import { get } from 'svelte/store'
  import Icon from "./Icon.svelte";
  
  export let elementKey;
  export let close = false;

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

<span on:click|stopPropagation={toggleBookmark}>
  {#if isBookmarked}
    {#if close}
      <Icon type="close" />
    {:else}
      GEMERKT
    {/if}
  {:else}
    MERKEN
  {/if}
</span>

<style>
  span:hover {
    cursor: pointer;
  }
</style>